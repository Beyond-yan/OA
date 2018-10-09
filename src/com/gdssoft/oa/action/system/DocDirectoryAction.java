package com.gdssoft.oa.action.system;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.model.system.DocDirectory;
import com.gdssoft.oa.model.system.DocFiles;
import com.gdssoft.oa.service.system.DepartmentService;
import com.gdssoft.oa.service.system.DocDirectoryService;
import com.gdssoft.oa.service.system.DocFilesService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;

public class DocDirectoryAction extends BaseAction{
	@Resource
	private DocDirectoryService docDirectoryService;
	@Resource
	private DepartmentService departmentService;
	
	private DocDirectory docDirectory;
	@Resource
	private DocFilesService docFilesService;
	
	private Long dicId;
	
	private String itemName;
	
	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}

	public Long getDicId() {
		return dicId;
	}

	public void setDicId(Long dicId) {
		this.dicId = dicId;
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
		/*AppUser curUser= ContextUtil.getCurrentUser();
		if(curUser.getDepartment().getDepId()!=100131){
			filter.addFilter("Q_department.depId_L_EQ",String.valueOf(curUser.getDepartment().getDepId()));
		}*/
		List<DocDirectory> list= docDirectoryService.getAll(filter);
		
		//查询文件总量大小
		DocDirectory queryDoc = new DocDirectory();
		queryDoc.setDirectoryName(getRequest().getParameter("Q_directoryName_S_LK"));
		if (getRequest().getParameter("Q_retentionYear_N_EQ") != null
				&& getRequest().getParameter("Q_retentionYear_N_EQ").length() > 0
				&& getRequest().getParameter("Q_retentionYear_N_EQ").indexOf("-") < 0) {
			queryDoc.setRetentionYear(Integer.parseInt(getRequest().getParameter("Q_retentionYear_N_EQ")));
		}
		if (getRequest().getParameter("Q_dirYear_N_EQ") != null
				&& getRequest().getParameter("Q_dirYear_N_EQ").length() > 0
				&& getRequest().getParameter("Q_dirYear_N_EQ").indexOf("-") < 0) {
			queryDoc.setDirYear(Integer.parseInt(getRequest().getParameter("Q_dirYear_N_EQ")));
		}
		if (getRequest().getParameter("Q_department.depId_L_EQ") != null
				&& getRequest().getParameter("Q_department.depId_L_EQ").length() > 0) {
			Department department = new Department();
			department.setDepId(Long.parseLong(getRequest().getParameter("Q_department.depId_L_EQ")));
			queryDoc.setDepartment(department);
		}
		Double totalBytes = docDirectoryService.getTotalBytes(queryDoc);
		
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
			.append(filter.getPagingBean().getTotalItems())
			.append(",totalBytes:").append(totalBytes)
			.append(",result:");
		JSONSerializer json = new JSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
				"createDate", "updateDate", "retention", "fileDate" });
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	
	
	/**
	 *目录树
	 *需要做的是：
	 *在所有部门的各节点查出目录，如存在就挂到该节点下
	 */
	public String tree(){
		String opt=getRequest().getParameter("opt");
		String rootId =getRequest().getParameter("root");
		StringBuffer buff = new StringBuffer();
		if(StringUtils.isNotEmpty(opt)){
			buff.append("[");
		}else{
			buff.append("[{id:'0',text:'文件目录',expanded:true,children:[");
		}
		List<DocDirectory> listParent;
		if (StringUtils.isNotEmpty(rootId)){
			//如果有root参数(第三级部门的id)，
			//根据root参数(当前用户的所在的第三级部门的id) 获取第三级部门下设科室，工班组等部门
			try{
				listParent=docDirectoryService.findByParentId(new Long(rootId));//第三级部门的部门Id								
			}
			//如果传递的第三级部门id不是一个合法的数字，则使用默认的顶层父节点
			catch(NumberFormatException ex){
				listParent=docDirectoryService.findByParentId(new Long(0));
			}
		}else{
			//如果没有传送root参数，默认使用最顶层父节点
			listParent=docDirectoryService.findByParentId(new Long(0));//最顶层父节点			
		}
		
		for(DocDirectory dep:listParent){
			/*List<Dictionary> dicList = departmentService.getByParentId(dep.getDepId());
			for (Dictionary dictionary : dicList) {
				List<Dictionary> dicList = departmentService.getByParentId(dictionary.getDicId());
				
			}*/
			buff.append("{id:'"+dep.getId()+"',text:'"+dep.getDirectoryName()+"',");
		    buff.append(findChild(dep.getId()));
		}
		
		if (!listParent.isEmpty()) {
			buff.deleteCharAt(buff.length() - 1);
	    }
		if(StringUtils.isNotEmpty(opt)){
		   buff.append("]");
		}else{
			buff.append("]}]");
		}
		setJsonString(buff.toString());
		return SUCCESS;
	}
	
	public String findChild(Long depId){
		StringBuffer buff1=new StringBuffer("");
		List<DocDirectory> list=docDirectoryService.findByParentId(depId);
		if(list.size()==0){
			buff1.append("leaf:true},");
			return buff1.toString(); 
		}else {
			buff1.append("expanded:true,children:[");
			
			
			for(DocDirectory dep2:list){				
				buff1.append("{id:'"+dep2.getId()+"',text:'"+dep2.getDirectoryName()+"',");
				buff1.append(findChild(dep2.getId()));
			}
			
			
			buff1.deleteCharAt(buff1.length() - 1);
			buff1.append("]},");
			return buff1.toString();
		}
	}
	
	public String listByDepId(){
		String opt=getRequest().getParameter("opt");
		String depId =getRequest().getParameter("depId");
		StringBuffer buff = new StringBuffer();
		
		buff.append("[");
		
		List<Department> listParent = new ArrayList<Department>();
		//listParent=departmentService.findByParentId(new Long(0),depId);//最顶层父节点
		Department dept = departmentService.get(Long.valueOf(depId));//最顶层父节点
		listParent.add(dept);
		for(Department dep:listParent){
			buff.append("{id:'"+dep.getDepId()+"',text:'"+dep.getDepName()+"',");
		    buff.append(findChild(dep.getDepId()));
		}
		if (!listParent.isEmpty()) {
			buff.deleteCharAt(buff.length() - 1);
	    }
		
		buff.append("]");
		
		setJsonString(buff.toString());
		
		return SUCCESS;
	}
	
	/*public String listByDepIds(){
		String opt=getRequest().getParameter("opt");
		String depIds =getRequest().getParameter("depIds");
		String[] depIdsArray=depIds.split(",");
		
		StringBuffer buff = new StringBuffer();
		
		buff.append("[");
		for(int i=0;i<depIdsArray.length;i++){
			List<Department> listParent = new ArrayList<Department>();
			Department dept = departmentService.get(Long.valueOf(depIdsArray[i]));//最顶层父节点
			listParent.add(dept);
			for(Department dep:listParent){
				buff.append("{id:'"+dep.getDepId()+"',text:'"+dep.getDepName()+"',");
			    buff.append(findChild(dep.getDepId()));
			}
			 buff.append(",");
			if (!listParent.isEmpty()) {
				buff.deleteCharAt(buff.length() - 1);
		    }
		}
		
		buff.append("]");
		
		setJsonString(buff.toString());
		return SUCCESS;
	}*/
	
	
	/**
	 * 批量删除
	 * @return
	 */
	public String multiDel(){
		
		String[]ids=getRequest().getParameterValues("ids");
		if(ids!=null){
			for(String id:ids){
				QueryFilter filter = new QueryFilter(getRequest());
				filter.addFilter("Q_docDirectory.id_L_EQ",id);
				List<DocFiles> docFilesList= docFilesService.getAll(filter);
				for(DocFiles docFiles : docFilesList){
					docFiles.setFileStatus((short) 0);
					docFiles.setRowNumber(null);
					docFiles.setFileNumber(null);
					docFiles.setDocDirectory(null);
					docFiles.setRetentionYear(1);
					docFilesService.save(docFiles);
				}
				docDirectoryService.remove(new Long(id));
			}
		}
		
		jsonString="{success:true}";
		
		return SUCCESS;
	}
	
	/**
	 * 显示详细信息
	 * @return
	 */
	public String get(){
		DocDirectory docDirectory=docDirectoryService.get(dicId);
		
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd"), new String[] {
				"retention", "createDate","updateDate" });
		sb.append(serializer.serialize(docDirectory));
		sb.append("}");
		setJsonString(sb.toString());
		jsonString=sb.toString();
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		String username = ContextUtil.getCurrentUser().getFullname();
		String userAccount=ContextUtil.getCurrentUser().getUsername();
		int year = docDirectory.getRetentionYear();
		switch (year) {
		case 0:
			docDirectory.setRetention(null);
			break;
		case 10:
			Calendar year1 = Calendar.getInstance();
			year1.add(Calendar.YEAR, year);
			Date date1 = year1.getTime();
			docDirectory.setRetention(date1);
			break;
		case 30:
			Calendar year3 = Calendar.getInstance();
			year3.add(Calendar.YEAR, year);
			Date date3 = year3.getTime();
			docDirectory.setRetention(date3);
			break;
		}

		if(docDirectory.getId()!=null){
			DocDirectory orgDic=docDirectoryService.get(docDirectory.getId());
			docDirectory.setUpdateUser(userAccount);
			docDirectory.setUpdateDate(new Date());
			try{
				BeanUtil.copyNotNullProperties(orgDic, docDirectory);
				docDirectoryService.save(orgDic);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}else{
			if(null == docDirectory.getParentId()){
				docDirectory.setParentId(new Long(0));
			}

			docDirectory.setCreateUser (username);
			docDirectory.setCreateDate(new Date());
			docDirectoryService.save(docDirectory);
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}
	
	/**
	 * 修改目录
	 */
	public String detail(){
		Long dirId=Long.parseLong(getRequest().getParameter("dirId"));
		docDirectory = docDirectoryService.get(dirId);
		
		StringBuffer sb = new StringBuffer("{\"success\":\"true\",\"data\":");
		
		JSONSerializer serializer = new JSONSerializer(); 
		//JSONSerializer serializer = JsonUtil.getJSONSerializer("retention","createDate", "updateDate");
		sb.append(serializer.exclude(new String[] { "class" }).serialize(docDirectory));
		sb.append("}");
		setJsonString(sb.toString());
		return SUCCESS;
	}
	
	/**
	 * 删除目录
	 */
	public String remove(){
		PagingBean pb=getInitPagingBean();
		Long dirId=Long.parseLong(getRequest().getParameter("dirId"));
		DocDirectory docDirectory=docDirectoryService.get(dirId);
		List userList=docFilesService.findByDirectoryId(dirId); //20121112 xt add
		System.out.println("id:"+dirId+";userListSize:"+userList.size());
    	if(userList.size()>0){
    		System.out.println("有文件，cannot success.");
    		setJsonString("{success:false,message:'该部门还有文件，请将文件转移后再删除目录!'}");
    		return SUCCESS;
    	}	
    	List deletedUserList=docFilesService.findByDirectoryId(dirId); //20121112 xt add
    	if(deletedUserList.size()>0){
    		System.out.println("有已删除文件存在，cannot success.");
    		setJsonString("{success:false,message:'该部门仍有文件，请将人员转移后再删除目录!'}");
    		return SUCCESS;
    	}
		List<DocDirectory> list=docDirectoryService.findByParentId(dirId); //20121112 xt	   
		System.out.println("list size:"+list.size());
	    //当该部门下都没有人员的时候才能删除子部门
	    if(list.size() > 0){
	    	System.out.println("该目录下有子目录...");
	    	setJsonString("{success:false,message:'该目录下有子目录，请将将子目录后转移再删除目录！'}");
			return SUCCESS;
	    }
	    System.out.println("删除目录..."+dirId);
		docDirectoryService.remove(dirId); //删除点击的那个父部门
		System.out.println("删除目录success.");
	    setJsonString("{success:true}");
		return SUCCESS;
	}
	
}