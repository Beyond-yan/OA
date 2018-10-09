package com.gdssoft.oa.action.document;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.Nestable;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import java.lang.reflect.Type;
import java.math.BigDecimal;
import com.gdssoft.oa.model.document.DocFolder;
import com.gdssoft.oa.model.document.Document;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.model.system.FileAttach;
import com.gdssoft.oa.service.document.DocFolderService;
import com.gdssoft.oa.service.document.DocPrivilegeService;
import com.gdssoft.oa.service.document.DocumentService;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.oa.service.system.FileAttachService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.core.web.paging.PagingBean;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;


/**
 * 
 * @author csx
 * 
 */
public class DocumentAction extends BaseAction {
	private Log log = LogFactory.getLog(DocumentAction.class);
	@Resource
	private DocumentService documentService;
	@Resource
	private FileAttachService fileAttachService;
	@Resource
	private DocFolderService docFolderService;
	@Resource
	private DocPrivilegeService docPrivilegeService;
	@Resource
	private AppUserService appUserService;
	private AppUser appUser;
	private Document document;
	private Date from;
	private Date to;

	public AppUser getAppUser() {
		return appUser;
	}

	public void setAppUser(AppUser appUser) {
		this.appUser = appUser;
	}

	public Date getFrom() {
		return from;
	}

	public void setFrom(Date from) {
		this.from = from;
	}

	public Date getTo() {
		return to;
	}

	public void setTo(Date to) {
		this.to = to;
	}

	private Long docId;

	public Long getDocId() {
		return docId;
	}

	public void setDocId(Long docId) {
		this.docId = docId;
	}

	public Document getDocument() {
		return document;
	}

	public void setDocument(Document document) {
		this.document = document;
	}

	/**
	 * 文档共享
	 * 
	 * @return
	 */
	public String share() {
		HttpServletRequest request = getRequest();
		String userIds = request.getParameter("sharedUserIds");
		String depIds = request.getParameter("sharedDepIds");
		String roleIds = request.getParameter("sharedRoleIds");
		String docId = request.getParameter("docId");
		String userNames = request.getParameter("sharedUserNames");
		String depNames = request.getParameter("sharedDepNames");
		String roleNames = request.getParameter("sharedRoleNames");
		
		Document doc = documentService.get(new Long(docId));
		if (StringUtils.isNotEmpty(userIds) || StringUtils.isNotEmpty(depIds)
				|| StringUtils.isNotEmpty(roleIds)) {
			doc.setSharedUserIds(null);
			doc.setSharedRoleIds(null);
			doc.setSharedDepIds(null);
			doc.setSharedUserNames(null);
			doc.setSharedDepNames(null);
			doc.setSharedRoleNames(null);
			doc.setIsShared(Document.SHARED);
			documentService.save(doc);
			
			doc.setSharedUserIds(userIds);
			doc.setSharedRoleIds(roleIds);
			doc.setSharedDepIds(depIds);
			doc.setSharedUserNames(userNames);
			doc.setSharedDepNames(depNames);
			doc.setSharedRoleNames(roleNames);
			doc.setIsShared(Document.SHARED);
			documentService.save(doc);
		}
		if (StringUtils.isEmpty(userIds) && StringUtils.isEmpty(depIds)
				&& StringUtils.isEmpty(roleIds)) {
			doc.setSharedUserIds(null);
			doc.setSharedRoleIds(null);
			doc.setSharedDepIds(null);
			doc.setSharedUserNames(null);
			doc.setSharedDepNames(null);
			doc.setSharedRoleNames(null);
			doc.setIsShared(Document.NOT_SHARED);
			documentService.save(doc);
		}

		//setJsonString("{success:true}");

		return SUCCESS;
	}

	/**
	 * 显示共享列表
	 */

	public String shareList() {
		PagingBean pb = getInitPagingBean();
		AppUser appUser = ContextUtil.getCurrentUser();
		Set<AppRole> appRoles = appUser.getRoles();
		Long depId = null;
		if (!appUser.getUserId().equals(AppUser.SUPER_USER)) {
			Department dep = appUser.getDepartment();
			depId = dep.getDepId();
		}
		Iterator<AppRole> it = appRoles.iterator();
		ArrayList<Long> arrayList = new ArrayList<Long>();
		while (it.hasNext()) {
			arrayList.add(((AppRole) it.next()).getRoleId());
		}
		List<Document> list = documentService.findByIsShared(document, from,
				to, appUser.getUserId(), arrayList, depId, pb);
		Type type = new TypeToken<List<Document>>() {
		}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(pb.getTotalItems()).append(",result:");
		Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation()
				.create();
		buff.append(gson.toJson(list, type));
		buff.append("}");
		setJsonString(buff.toString());
		return SUCCESS;
	}

	/**
	 * 显示列表
	 */
	public String list() {
		QueryFilter filter = new QueryFilter(getRequest());
		//String depId=getRequest().getParameter("depId");
	/*	String startStr = getRequest().getParameter("form");
		String endStr = getRequest().getParameter("to") ;
		java.text.SimpleDateFormat sdf=new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date start = new Date();
        Date end = new Date();
        if(null!=startStr&&!"".equals(startStr)){
		try {
			start = sdf.parse(startStr + " " + "00:00:00");
			filter.addFilter("Q_createtime_D_GE", start.toString());
			//log.debug("转换格式后的参数  from = " + start + "   to = " + end);
		} catch (ParseException e) {
			log.warn("传入参数  from  , to 格式转换出错!");
		}}
        
        if(null!=endStr&&!"".equals(endStr)){
    		try {
    			end  = sdf.parse(endStr+ " " + "23:59:59");
    			filter.addFilter("Q_createtime_DG_LE", end.toString());
    			//log.debug("转换格式后的参数  from = " + start + "   to = " + end);
    		} catch (ParseException e) {
    			log.warn("传入参数  from  , to 格式转换出错!");
    		}}	*/
		/*filter.addFilter("Q_docFolder.appUser.userId_L_EQ", ContextUtil
				.getCurrentUserId().toString());*/
		filter.addFilter("Q_appUser.userId_L_EQ", ContextUtil
				.getCurrentUserId().toString());
		filter.addFilter("Q_depId_L_EQ","-1");
		
		String folderId = getRequest().getParameter("folderId");
		String path = null;
		if (StringUtils.isNotEmpty(folderId) && !"0".equals(folderId)) {
			path = docFolderService.get(new Long(folderId)).getPath();
		}
		if (path != null) {
			filter.addFilter("Q_docFolder.path_S_LK", path + "%");
		}
		List<Document> list = documentService.getAll(filter);
		Type type = new TypeToken<List<Document>>() {
		}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");
		Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation()
				.create();
		buff.append(gson.toJson(list, type));
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
	}

	/**
	 * 公共文档列表
	 */

	public String publicList() {
		PagingBean pb = getInitPagingBean();
		String strFolderId = getRequest().getParameter("folderId");
		String path = null;
		if (StringUtils.isNotEmpty(strFolderId)) {
			Long folderId = new Long(strFolderId);
			if (folderId > 0) {
				path = docFolderService.get(new Long(strFolderId)).getPath();
			}
		}
		List<Document> list = documentService.findByPublic(path, document,
				from, to, ContextUtil.getCurrentUser(), pb);
		Type type = new TypeToken<List<Document>>() {
		}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(pb.getTotalItems()).append(",result:");
		Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation()
				.create();
		buff.append(gson.toJson(list, type));
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
	}

	/**
	 * 批量删除
	 * 
	 * @return
	 */
	public String multiDel() {
		AppUser appUser = ContextUtil.getCurrentUser();
		String[] ids = getRequest().getParameterValues("ids");
		if (ids != null) {
			for (String id : ids) {
				
				Document doc = documentService.get(new Long(id));
				Set<FileAttach> fileAttachList = doc.getAttachFiles();
				Iterator<FileAttach> iterator = fileAttachList.iterator();
				FileAttach fileAttach;
				BigDecimal fileAttachSumSize= new BigDecimal(0);
				//计算文档对应的附件总大小
				while (iterator.hasNext()){
					fileAttach = (FileAttach)iterator.next();
					String note = fileAttach.getNote();
					BigDecimal size = new BigDecimal(fileAttach.getTotalBytes()/1024);
					fileAttachSumSize=fileAttachSumSize.add(size);
				}
				//删除文件后更新用户的上传空间大小
				//appUser.setCapacity(appUser.getCapacity().add(fileAttachSumSize));
				appUser.setInUseCapacity(appUser.getInUseCapacity().subtract(fileAttachSumSize));
				appUserService.merge(appUser);
				
				documentService.remove(new Long(id));
			}
			
		}

		jsonString = "{success:true}";

		return SUCCESS;
	}

	/**
	 * 显示详细信息
	 * 
	 * @return
	 */
	public String get() {
		Document document = documentService.get(docId);
		Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation()
				.create();
		// 将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:[");
		sb.append(gson.toJson(document));
		sb.append("]}");
		setJsonString(sb.toString());
		return SUCCESS;
	}

	/**
	 * 添加及保存操作
	 */
	public String save() {
		//取得当前登录用户
		AppUser appUser = ContextUtil.getCurrentUser();
		//获取附件ids
		String fileIds = getRequest().getParameter("fileIds");
		String depId = getRequest().getParameter("depId");
		String folderId = getRequest().getParameter("folderId");
		document.setSharedDepIds(document.getSharedDepIds());
		document.setSharedRoleIds(document.getSharedRoleIds());
		document.setSharedUserIds(document.getSharedUserIds());
		if(depId!=null&&!"".equals(depId)){
			document.setDepId(new Long(depId));
		}else{
			document.setDepId(new Long(-1));
		}
		//保存附件
		if (StringUtils.isNotEmpty(fileIds)) {
			document.getAttachFiles().clear();
			String[] fIds = fileIds.split(",");
			for (int i = 0; i < fIds.length; i++) {
				FileAttach fileAttach = fileAttachService
						.get(new Long(fIds[i]));
				document.getAttachFiles().add(fileAttach);
			}
		}

		if (StringUtils.isNotEmpty(folderId) && !"0".equals(folderId)) {
			DocFolder folder = docFolderService.get(new Long(folderId));
			document.setDocFolder(folder);
		}
		//取得用户现有的上传空间大小
		BigDecimal capacity = appUser.getCapacity();
		//取得用户已经使用的空间大小
		BigDecimal inUseCapacity = appUser.getInUseCapacity();
		//计算剩余空间大小
		BigDecimal laveCapacity = capacity.subtract(inUseCapacity);
		//默认为true 表示保存
		boolean isSave = true;
		//新增
		if (document.getDocId() == null) {
			document.setAppUser(appUser);
			document.setFullname(appUser.getFullname());
			document.setCreatetime(new Date());
			document.setUpdatetime(new Date());
			document.setIsShared(Document.NOT_SHARED);
			
			// 包括附件
			if (document.getAttachFiles().size() > 0) {
				//取得该文档对应的附件
				Set<FileAttach> fileAttachList = document.getAttachFiles();
				Iterator<FileAttach> iterator = fileAttachList.iterator();
				FileAttach fileAttach;
				BigDecimal fileAttachSumSize= new BigDecimal(0);
				//计算文档对应的附件总大小
				while (iterator.hasNext()){
					fileAttach = (FileAttach)iterator.next();
					String note = fileAttach.getNote();
					BigDecimal size = new BigDecimal(fileAttach.getTotalBytes()/1024);
					fileAttachSumSize=fileAttachSumSize.add(size);
				}
				if(laveCapacity.compareTo(fileAttachSumSize)>=0){
					//capacity =capacity.subtract(fileAttachSumSize);
					inUseCapacity = inUseCapacity.add(fileAttachSumSize);
					//appUser.setCapacity(capacity);
					appUser.setInUseCapacity(inUseCapacity);
					//同步更新共享空间
					appUserService.merge(appUser);
				}else {
					//共享空间不足
					isSave = false;
					
					StringBuffer buff = new StringBuffer("{success:true").
					append(",message:'"+"error").append("'");
					buff.append("}");
					setJsonString(buff.toString());
				}
				
			} else {
				document.setHaveAttach(Document.NOT_HAVE_ATTACH);
			}
			if(isSave){
				document.setHaveAttach(Document.HAVE_ATTACH);
				documentService.save(document);
				setJsonString("{success:true}");
			}
		} else {
			Document doc = documentService.get(document.getDocId());
			doc.setUpdatetime(new Date());
			doc.setDocName(document.getDocName());
			doc.setContent(document.getContent());
			doc.setAttachFiles(document.getAttachFiles());
			if (document.getAttachFiles().size() > 0) {
				Set<FileAttach> fileAttachList = document.getAttachFiles();
				Iterator<FileAttach> iterator = fileAttachList.iterator();
				FileAttach fileAttach;
				BigDecimal fileAttachSumSize= new BigDecimal(0);
				//计算文档对应的附件总大小
				while (iterator.hasNext()){
					fileAttach = (FileAttach)iterator.next();
					String note = fileAttach.getNote();
					BigDecimal size = new BigDecimal(fileAttach.getTotalBytes()/1024);
					fileAttachSumSize=fileAttachSumSize.add(size);
				}
				if(capacity.compareTo(fileAttachSumSize)>=0){
					
					inUseCapacity = inUseCapacity.add(fileAttachSumSize);
					//appUser.setCapacity(capacity);
					appUser.setInUseCapacity(inUseCapacity);
					//同步更新共享空间
					appUserService.merge(appUser);
				}else {
					//共享空间不足
					isSave = false;
					StringBuffer buff = new StringBuffer("{success:true").
					append(",message:'"+"error").append("'");
					buff.append("}");
					setJsonString(buff.toString());
				}
				
			} else {
				doc.setHaveAttach(Document.NOT_HAVE_ATTACH);
			}
			if(isSave){
				doc.setHaveAttach(Document.HAVE_ATTACH);
				documentService.save(doc);
				setJsonString("{success:true}");
			}
			
		}
		return SUCCESS;
	}

	/**
	 * 文档页面详细信息显示
	 * 
	 * 
	 * 
	 */
	public String detail() {
		String strDocId = getRequest().getParameter("docId");
		if (StringUtils.isNotEmpty(strDocId)) {
			Long docId = Long.parseLong(strDocId);
			document = documentService.get(docId);
		}
		return "detail";
	}

	public String publicDetail() {
		String strDocId = getRequest().getParameter("docId");
		if (StringUtils.isNotEmpty(strDocId)) {
			Long docId = Long.parseLong(strDocId);
			document = documentService.get(docId);
		}
		return "publicDetail";
	}

	/**
	 * 获取权限的分配
	 * 
	 * @return
	 */
	public String right() {
		String strDocId = getRequest().getParameter("docId");
		Integer right = 0;
		Document document = new Document();
		AppUser appUser = ContextUtil.getCurrentUser();
		if (StringUtils.isNotEmpty(strDocId)) {
			Long docId = new Long(strDocId);
			right = docPrivilegeService.getRightsByDocument(appUser, docId);
			document = documentService.get(docId);
		}
		Integer rightD = 0;
		Integer rightM = 0;
		String strRight = Integer.toBinaryString(right);
		char[] cc = strRight.toCharArray();
		if (cc.length == 2) {
			if (cc[0] == '1') {
				rightM = 1;
			}
		}
		if (cc.length == 3) {
			if (cc[0] == '1') {
				rightD = 1;
			}
			if (cc[1] == '1') {
				rightM = 1;
			}
		}

		setJsonString("{success:true,rightM:'" + rightM + "',rightD:'" + rightD
				+ "',docName:'" + document.getDocName() + "'}");
		return SUCCESS;
	}

	public String search() {
		PagingBean pb = getInitPagingBean();
		String content = getRequest().getParameter("content");
		AppUser appUser = ContextUtil.getCurrentUser();
		List<Document> list = documentService.searchDocument(appUser, content,
				pb);
		Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation()
				.create();
		Type type = new TypeToken<List<Document>>() {
		}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(pb.getTotalItems()).append(",result:");
		buff.append(gson.toJson(list, type));
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
	}

	/**
	 * 首页显示的我的文档列表
	 */
	public String display() {
		QueryFilter filter = new QueryFilter(getRequest());
		filter.addFilter("Q_docFolder.appUser.userId_L_EQ", ContextUtil
				.getCurrentUserId().toString());
		List<Document> list = documentService.getAll(filter);
		getRequest().setAttribute("documentList", list);
		return "display";
	}
	/**
	 * 显示处室文档列表
	 */
	public String listOff() {
		String depId=getRequest().getParameter("depId");
		QueryFilter filter = new QueryFilter(getRequest());
		if(ContextUtil.getCurrentUser().getIsAdmin()){
			filter.addFilter("Q_depId_L_GT", "-1");
		}else {
			filter.addFilter("Q_depId_L_EQ", depId);
		}
		String folderId = getRequest().getParameter("folderId");
		String path = null;
		if (StringUtils.isNotEmpty(folderId) && !"0".equals(folderId)) {
			path = docFolderService.get(new Long(folderId)).getPath();
		}
		if (path != null) {
			filter.addFilter("Q_docFolder.path_S_LK", path + "%");
		}
		List<Document> list = documentService.getAll(filter);
		Type type = new TypeToken<List<Document>>() {
		}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");
		Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation()
				.create();
		buff.append(gson.toJson(list, type));
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
	}
}
