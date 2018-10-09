package com.gdssoft.oa.action.system;
 
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.archive.ArchivesDoc;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.DocDirectory;
import com.gdssoft.oa.model.system.DocFileList;
import com.gdssoft.oa.model.system.DocFiles;
import com.gdssoft.oa.model.system.FileAttach;
import com.gdssoft.oa.service.archive.ArchivesDocService;
import com.gdssoft.oa.service.system.DocDirectoryService;
import com.gdssoft.oa.service.system.DocFileListService;
import com.gdssoft.oa.service.system.DocFilesService;
import com.gdssoft.oa.service.system.FileAttachService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;
public class DocFilesAction extends BaseAction{
	
	
	@Resource
	private DocFilesService docFilesService;
	@Resource
	private DocDirectoryService docDirectoryService;
	@Resource
	private FileAttachService fileAttachService;
	@Resource
	private DocFileListService docFileListService;
	@Resource
	private ArchivesDocService archivesDocService;
	
	private DocFiles  docFiles;
	
	private DocDirectory docDirectory;
	
	private Long fileId;

	public DocFiles getDocFiles() {
		return docFiles;
	}

	public void setDocFiles(DocFiles docFiles) {
		this.docFiles = docFiles;
	}
	
	public Long getFileId() {
		return fileId;
	}

	public void setFileId(Long fileId) {
		this.fileId = fileId;
	}
	public DocDirectory getDocDirectory() {
		return docDirectory;
	}

	public void setDocDirectory(DocDirectory docDirectory) {
		this.docDirectory = docDirectory;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		QueryFilter filter = new QueryFilter(getRequest());
		String isRowNumberSort = getRequest().getParameter("isRowNumberSort");
		if(isRowNumberSort!=null&&StringUtils.isNotEmpty(isRowNumberSort)&&"true".equals(isRowNumberSort)){
			filter.addSorted("rowNumber", "asc");
		}
	/*	AppUser curUser= ContextUtil.getCurrentUser();
		if(curUser.getDepartment().getDepId()!=100131){
			filter.addFilter("Q_department.depId_L_EQ",String.valueOf( curUser.getDepartment().getDepId()));
		}*/
		List<DocFiles> list= docFilesService.getAll(filter);
		/*for(DocFiles docFiles:list){
			if(null!=docFiles.getSourceType()&&"1".equals(docFiles.getSourceType().toString())){
				Archives archives =new Archives();
				archives.setIssueDep(docFiles.getFileIssup());
				docFiles.setArchives(archives);
			}
		}
		Collections.sort(list, new Comparator() {		
		    public int compare(Object a, Object b) {
		    	int ret = 0;
		    	Long m1 = ((DocFiles)a).getRowNumber();
				Long m2 = ((DocFiles)b).getRowNumber();
					ret =  m1.compareTo(m2);
		    	return ret;
		    }
		 });*/
		for (DocFiles docFiles : list) {
			double totalBytes = 0;
			if (docFiles.getFileList() != null 
					&& docFiles.getFileList().size() > 0) {
				for (FileAttach fileAttach : docFiles.getFileList()) {
					if (fileAttach.getTotalBytes() != null)
						totalBytes += fileAttach.getTotalBytes();
				}
			}
			docFiles.setTotalBytes(totalBytes);;
		}
		
		
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
			.append(filter.getPagingBean().getTotalItems()).append(",result:");
		JSONSerializer json = new JSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
				"createDate", "updateDate","fileDate", "retention"});
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	
	/**
	 * 显示详细信息
	 * @return
	 */
	public String get(){
		DocFiles docFiles = docFilesService.get(fileId);
		System.out.println("--------docFiles----------"+docFiles.getFileList());
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
				"fileDate",  "createDate","updateDate" });
		sb.append(serializer.serialize(docFiles));
		//sb.append(serializer.exclude(new String[] { "class" }).serialize(docFiles));
		sb.append("}");
		//setJsonString(sb.toString());
		jsonString=sb.toString();
		
	/*	//Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().setDateFormat("yyyy-MM-dd").create();
		Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(docFiles));
		sb.append("}");
		
		setJsonString(sb.toString());*/

		return SUCCESS;
	}
	
	/**
	 * 显示详细信息
	 * @return
	 */
	public String getAttach(){
		DocFiles docFiles = docFilesService.get(fileId);
		List<FileAttach> faList=new ArrayList();
		 Set<FileAttach> fileList=new HashSet<FileAttach>();
		 fileList=docFiles.getFileList();
		 if(fileList.size()>0){
			 Iterator<FileAttach> it = fileList.iterator();
			 while (it.hasNext()) {
					FileAttach f = it.next();
					faList.add(f);
			 }
		 }
		 StringBuffer buff = new StringBuffer("{success:true").append(",result:");
		JSONSerializer json = new JSONSerializer();
		buff.append(json.exclude(new String[] { "class" }).serialize(faList));
		buff.append("}");
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	
	public String select() {
		logger.info("-------------coming into select methods----------");
		String strDepId = getRequest().getParameter("dirId");
		// 表示从上级目录开始进行查找
		Long parentId = new Long(0);
		if (StringUtils.isNotEmpty(strDepId)) {
			Long depId = Long.parseLong(strDepId);
			DocDirectory docd = docDirectoryService.get(depId);
			if (docd != null) {
				parentId = docd.getParentId();
			}
		} else {}
		List<DocFiles> list = docFilesService.findByDirectoryId(new Long(strDepId));
		int total=list.size();
		limit =20;
		logger.info("starte:"+start);	
		start=(start==null?0:start);		
		logger.info("starte:"+start);
		int endIndex = start+limit;
		if(endIndex >list.size()){
			endIndex =list.size();
		}
		list=list.subList(start, endIndex);
		logger.info("-------------list----------"+list);
		StringBuffer buff = new StringBuffer("{\"success\":\"true\",\"totalCounts\":")
				.append(total).append(",\"result\":");
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
			"createDate", "updateDate", "retention", "fileDate" });
		buff.append(serializer.exclude(new String[] { "password" }).serialize(
				list));
		buff.append("}");

		jsonString = buff.toString();
		logger.info("-------------jsonString----------"+jsonString);
		return SUCCESS;
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	public String save(){
		Long rid=null;
		String username = ContextUtil.getCurrentUser().getUsername();
		String attachIds = getRequest().getParameter("attachIds");
		java.util.Set faList = new HashSet();
		if(attachIds  != null&&attachIds!=""){
			String[] fileIds = attachIds.split(",");
			for (String id : fileIds) {
				FileAttach fa=fileAttachService.get(new Long(id));
				faList.add(fa);
			}
		}
		docFiles.setFileList(faList);
	/*	int year = docFiles.getRetentionYear();
		switch(year){
		case 0:
			docFiles.setRetention(null);
			break;
		case 10:
			Calendar year1 = Calendar.getInstance();
			year1.add(Calendar.YEAR, year);
			Date date1 = year1.getTime();
			docFiles.setRetention(date1);
			break;
		case 30:
			Calendar year3 = Calendar.getInstance();
			year3.add(Calendar.YEAR, year);
			Date date3 = year3.getTime();
			docFiles.setRetention(date3);
			break;
		}*/
		if(null == docFiles.getId()){
			docFiles.setFileStatus((short) 0);
			docFiles.setCreateUser (username);
			docFiles.setCreateDate(new Date());
			docFilesService.save(docFiles);
			rid=docFiles.getId();
		}else{
			DocFiles orgDocFiles = docFilesService.get(docFiles.getId());
			try{
				Set docFileList=orgDocFiles.getFileList();
				orgDocFiles.setFileList(docFileList);
				docFiles.setUpdateUser(username);
				docFiles.setUpdateDate(new Date());
				BeanUtil.copyNotNullProperties(orgDocFiles, docFiles);
				docFilesService.save(orgDocFiles);
				rid=docFiles.getId();
			}catch(Exception ex){
			}
		}
		
		String params = getRequest().getParameter("params");
		if (StringUtils.isNotEmpty(params)) {
			Gson gson =new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
			DocFileList[] dls = gson.fromJson(params, DocFileList[].class);
			if (dls != null && dls.length > 0) {
				for (DocFileList dl : dls) {
					dl.setFileId(rid);
					dl.setCreateUser(username);
					dl.setCreateDate(new Date());
					docFileListService.save(dl);

				}
			}

		}
		setJsonString("{success:true}");
		return SUCCESS;
	}

	public DocDirectoryService getDocDirectoryService() {
		return docDirectoryService;
	}

	public void setDocDirectoryService(DocDirectoryService docDirectoryService) {
		this.docDirectoryService = docDirectoryService;
	}
	
	/**
	 * 刪除文件
	 */
	@SuppressWarnings("rawtypes")
	public String multiDel() {
		String[] ids = getRequest().getParameterValues("ids");
		if (ids != null) {
			for (String id : ids) {
				DocFiles file = (DocFiles)docFilesService.get(new Long(id));
				java.util.Set docFileList = file.getFileList();
				Iterator lists = docFileList.iterator();
				file.setArchives(null);
				docFilesService.save(file);
				//docFilesService.remove(new Long(id));
				/*while(lists.hasNext()){
					FileAttach fileAttach = (FileAttach)lists.next();
					//FileAttach fileAttach = list.getFileAttach();
					//docFileListService.remove(list);
					//docFileListService.flush();
					//fileAttachService.removeByPath(fileAttach.getFilePath());
				}*/
				docFilesService.remove(new Long(id));
				docFilesService.flush();
			}
		}
		jsonString = "{success:true}";
		return SUCCESS;
	}
	public String updateDownLoad() {
		String params = getRequest().getParameter("params");
		logger.debug("params="+params);
		if (StringUtils.isNotEmpty(params)) {
			Gson gson =new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
			DocFileList[] rls = gson.fromJson(params, DocFileList[].class);
			if (rls != null && rls.length > 0) {
				for (DocFileList rl : rls) {
					docFileListService.save(rl);
				}
			}

		}
		setJsonString("{success:true}");
		return SUCCESS;
	}
	
	public String updateDirectory(){
		String docDirectroyId=getRequest().getParameter("docDirectoryId");
		int beginNumber=this.getAmount(docDirectroyId);
		DocDirectory dd=docDirectoryService.get(new Long(docDirectroyId));
		String[] docFileIds = getRequest().getParameterValues("docFilesIds");
		if (docFileIds != null) {
			int i=beginNumber+1;
			for (String id : docFileIds) {
				DocFiles df=docFilesService.get(new Long(id));
				df.setDocDirectory(dd);
				df.setFileStatus((short) 1);
				df.setRowNumber(new Long(i));
				df.setRetentionYear(dd.getRetentionYear());
				docFilesService.save(df);
				i=i+1;
			}
			int amount=this.getAmount(docDirectroyId);
			dd.setFileAmount(amount);
			dd.setIsMakeFileNumber(0);
			docDirectoryService.save(dd);
		}
			setJsonString("{success:true}");
			return SUCCESS;
	}
	
	
	
	public String unbindDirectory(){
		String docDirectroyId=getRequest().getParameter("docDirectoryId");
		DocDirectory dd=docDirectoryService.get(new Long(docDirectroyId));
		String[] docFileIds = getRequest().getParameterValues("docFilesIds");
		String schemaCode = ContextUtil.getCurrentUser().getOwnerSchema();
		if (docFileIds != null) {
			for (String id : docFileIds) {
				DocFiles df=docFilesService.get(new Long(id));
				df.setDocDirectory(null);
				df.setRowNumber(null);
				df.setFileNumber(null);
				df.setFileStatus((short) 0);
				df.setRetentionYear(1);
				docFilesService.save(df);
				
			}
			int amount=this.getAmount(docDirectroyId);
			dd.setFileAmount(amount);
			docDirectoryService.save(dd);
			docFilesService.refreshRowNumber(schemaCode, new Long(docDirectroyId));
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}
	
	public int getAmount(String docDirectoryId){
		QueryFilter filter = new QueryFilter(getRequest());
		filter.getPagingBean().setPageSize(999999999);
		filter.addFilter("Q_docDirectory.id_L_EQ",docDirectoryId);
		List<DocFiles> list= docFilesService.getAll(filter);
		if(!list.isEmpty()){
			return list.size();
		}else{
			return 0;
		}
		
	}
	
	/**
	 * 根据公文ID进行存档
	 * @author tony zhang
	 * @return
	 */
	public String saveDocFromArchives(){
		String archivesId = getRequest().getParameter("archivesId");
		StringBuffer sb = new StringBuffer();
		if(StringUtils.isBlank(archivesId)){
			sb.append("{success:failed,data:'archivesId is null!'");
			sb.append("}");
			setJsonString(sb.toString());
			return SUCCESS;
		}
		if(StringUtils.isNotEmpty(archivesId)){
			List<ArchivesDoc> archDocs=archivesDocService.findByAid(new Long(archivesId));
			for(ArchivesDoc doc:archDocs){
				doc.setIsFinish((short) 1);
				archivesDocService.save(doc);
			}
		}
		docFilesService.saveDocFilesFromArchives(Long.parseLong(archivesId), ContextUtil.getCurrentUser().getUsername());
		setJsonString("{success:true}");
		return SUCCESS;
	}
	/**
	 * 改变行号
	 * @author sicen.liu/2014.10.29
	 * @return
	 */
	public String updateRowNumber(){
		String fileId = getRequest().getParameter("fileId");
		String directoryId = getRequest().getParameter("directoryId");
		String docFileRowNumber = getRequest().getParameter("docFileRowNumber");
		String schemaCode = ContextUtil.getCurrentUser().getOwnerSchema();
		DocFiles df=docFilesService.get(new Long(fileId));
		docFilesService.updateRowNumber(schemaCode, new Long(directoryId), new Long(docFileRowNumber),df.getRowNumber());
		df.setRowNumber(new Long(docFileRowNumber));
		docFilesService.save(df);
		return SUCCESS;
	}
	/**
	 * 档案管理更新件号
	 * @author sicen.liu/2014.10.30
	 * @return
	 */
	public String updateFileNumber(){
		String isFileNumberFinish = getRequest().getParameter("isFileNumberFinish");
		if(isFileNumberFinish!=null&&StringUtils.isNotEmpty(isFileNumberFinish)&&"true".equals(isFileNumberFinish)){
			DocDirectory orgDic=docDirectoryService.get(docDirectory.getId());
			orgDic.setUpdateUser(ContextUtil.getCurrentUser().getUsername());
			orgDic.setUpdateDate(new Date());
			orgDic.setStartFileNo(docDirectory.getStartFileNo());
			orgDic.setIsMakeFileNumber(1);
			docDirectoryService.save(orgDic);
			String schemaCode = ContextUtil.getCurrentUser().getOwnerSchema();
			docFilesService.refreshRowNumber(schemaCode, docDirectory.getId());
			docFilesService.updateFileNumber(schemaCode, docDirectory.getId(), docDirectory.getStartFileNo());
		}
		return SUCCESS;
	}
}
