package com.gdssoft.oa.action.archive;

/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.JsonUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.model.archive.ArchDispatch;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.archive.ArchivesDep;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.archive.ArchDispatchService;
import com.gdssoft.oa.service.archive.ArchivesDepService;
import com.gdssoft.oa.service.archive.ArchivesService;
import com.gdssoft.oa.service.system.AppRoleService;
import com.gdssoft.oa.service.system.AppUserService;
import com.google.gson.Gson;

import flexjson.JSONSerializer;

/**
 * 
 * @author
 * 
 */
public class ArchDispatchAction extends BaseAction {
	@Resource
	private ArchDispatchService archDispatchService;
	private ArchDispatch archDispatch;

	@Resource
	private ArchivesService archivesService;
	@Resource
	private AppUserService appUserService;
	@Resource
	private AppRoleService appRoleService;
	@Resource
	private ArchivesDepService archivesDepService;

	private Long dispatchId;
	private Long archivesId;
	private Short archUserType;
	private String readFeedback;

	
	public Short getArchUserType() {
		return archUserType;
	}

	public void setArchUserType(Short archUserType) {
		this.archUserType = archUserType;
	}

	public String getReadFeedback() {
		return readFeedback;
	}

	public void setReadFeedback(String readFeedback) {
		this.readFeedback = readFeedback;
	}

	public Long getArchivesId() {
		return archivesId;
	}

	public void setArchivesId(Long archivesId) {
		this.archivesId = archivesId;
	}

	public Long getDispatchId() {
		return dispatchId;
	}

	public void setDispatchId(Long dispatchId) {
		this.dispatchId = dispatchId;
	}

	public ArchDispatch getArchDispatch() {
		return archDispatch;
	}

	public void setArchDispatch(ArchDispatch archDispatch) {
		this.archDispatch = archDispatch;
	}

	/**
	 * 显示列表
	 */
	public String list() {

		QueryFilter filter = new QueryFilter(getRequest());
		filter.addFilter("Q_userId_L_EQ", ContextUtil.getCurrentUserId()
				.toString());
		List<ArchDispatch> list = archDispatchService.getAll(filter);

		// Type type=new TypeToken<List<ArchDispatch>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");

		// Gson gson=new Gson();
		// buff.append(gson.toJson(list, type));
		JSONSerializer serializer = JsonUtil.getJSONSerializer("dispatchTime","archives.issueDate","archives.createtime");
		buff.append(serializer.exclude(new String[] { "class" })
				.serialize(list));
		buff.append("}");

		jsonString = buff.toString();

		return SUCCESS;
	}

	/**
	 * 当前用户可分发的公文列表
	 */
	public String disList() {
		PagingBean pb = getInitPagingBean();
		List<ArchDispatch> list = archDispatchService.findByUser(ContextUtil
				.getCurrentUser(), pb);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(pb.getTotalItems()).append(",result:");

		JSONSerializer serializer = JsonUtil.getJSONSerializer("dispatchTime");
		buff.append(serializer.exclude(new String[] { "class" })
				.serialize(list));
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

		String[] ids = getRequest().getParameterValues("ids");
		if (ids != null) {
			for (String id : ids) {
				archDispatchService.remove(new Long(id));
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
		ArchDispatch archDispatch = archDispatchService.get(dispatchId);

		Gson gson = new Gson();
		// 将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(archDispatch));
		sb.append("}");
		setJsonString(sb.toString());

		return SUCCESS;
	}

	
	/**
	 * 添加及保存操作分发公文记录
	 */
	public String save() {
		Archives archives = archivesService.get(archivesId);
		String archivesStatus = getRequest().getParameter("archivesStatus");
		if (archives != null) {
			if(StringUtils.isNotEmpty(archivesStatus)){
				archives.setStatus(Short.parseShort(archivesStatus));
			}
			ArchDispatch archDispatch = new ArchDispatch();
			AppUser user=ContextUtil.getCurrentUser();
			archDispatch.setArchives(archives);
			archDispatch.setArchUserType(archUserType);
			archDispatch.setUserId(user.getUserId());
			archDispatch.setFullname(user.getFullname());
			archDispatch.setDispatchTime(new Date());
			archDispatch.setSubject(archives.getSubject());
			archDispatch.setIsRead(ArchDispatch.HAVE_READ);
			archDispatch.setReadFeedback(readFeedback);
			archDispatchService.save(archDispatch);
			
			if(archUserType.compareTo(ArchDispatch.IS_DISPATCH)==0){//为分发公文
				archivesService.save(archives);
			}else{
				String signUserIds=getRequest().getParameter("undertakeUserIds");
				String cruArchDepId=getRequest().getParameter("cruArchDepId");
				if(StringUtils.isNotEmpty(signUserIds)){
					String[] signId=signUserIds.split(",");
					int size=signId.length;
					if(size<2){//当承办人只有一个人的时候，则进入此步操作
						if(archUserType.compareTo(ArchDispatch.IS_UNDERTAKE)==0){//为承办
							if(StringUtils.isNotEmpty(cruArchDepId)&&cruArchDepId.indexOf("$")==-1){
							   ArchivesDep archivesDep= archivesDepService.get(new Long(cruArchDepId));
							   StringBuffer sb=new StringBuffer("<div>"+readFeedback);
							   SimpleDateFormat sdf=new SimpleDateFormat();
							   sdf.format(new Date());
							   sb.append("--").append(ContextUtil.getCurrentUser().getFullname()).append("--").append(sdf.format(new Date())).append("</div>");
							   archivesDep.setHandleFeedback(sb.toString());
							   archivesDepService.save(archivesDep);
							}
						}
					}else{//承办人超过两个以上的
						int recordSize=archDispatchService.countArchDispatch(archives.getArchivesId());
						if(archUserType.compareTo(ArchDispatch.IS_UNDERTAKE)==0){//为承办
							if(StringUtils.isNotEmpty(cruArchDepId)&&cruArchDepId.indexOf("$")==-1){
								   ArchivesDep archivesDep= archivesDepService.get(new Long(cruArchDepId));
								   StringBuffer sb=new StringBuffer();
								   if(archivesDep.getHandleFeedback()!=null){
									   sb.append(archivesDep.getHandleFeedback());
								   }
								   sb.append("<div>"+readFeedback);
								   SimpleDateFormat sdf=new SimpleDateFormat();
								   sdf.format(new Date());
								   sb.append("--").append(ContextUtil.getCurrentUser().getFullname()).append("--").append(sdf.format(new Date())).append("</div>");
								   archivesDep.setHandleFeedback(sb.toString());
								   archivesDepService.save(archivesDep);
							}
						}
					}
				}
			 archivesService.save(archives);
			}
			setJsonString("{success:true}");
		} else {
			setJsonString("{success:false}");
		}
		return SUCCESS;
	}
//	/**
//	 * 添加及保存操作分发公文记录
//	 */
//	public String save() {
//		Archives archives = archivesService.get(archivesId);
//		if (archives != null) {
//			ArchDispatch archDispatch = new ArchDispatch();
//			AppUser user=ContextUtil.getCurrentUser();
//			archDispatch.setArchives(archives);
//			archDispatch.setArchUserType(archUserType);
//			archDispatch.setUserId(user.getUserId());
//			archDispatch.setFullname(user.getFullname());
//			archDispatch.setDispatchTime(new Date());
//			archDispatch.setSubject(archives.getSubject());
//			archDispatch.setIsRead(ArchDispatch.HAVE_READ);
//			archDispatch.setReadFeedback(readFeedback);
//			archDispatchService.save(archDispatch);
//			
//			if(archUserType.compareTo(ArchDispatch.TYPE_DISPATCH)==0){
//				archives.setStatus(Archives.STATUS_HANDLE);
//				archivesService.save(archives);
//			}else if(archUserType.compareTo(ArchDispatch.TYPE_APPLY)==0){
//				archives.setStatus(Archives.STATUS_BACK);
//				archivesService.save(archives);
//			}else if(archUserType.compareTo(ArchDispatch.TYPE_BACK)==0){
//				archives.setStatus(Archives.STATUS_END);
//				archivesService.save(archives);
//			}else{
//				String signUserIds=getRequest().getParameter("handlerUserIds");
////				String cruArchDepId=getRequest().getParameter("cruArchDepId");
//				if(StringUtils.isNotEmpty(signUserIds)){
//					String[] signId=signUserIds.split(",");
//					int size=signId.length;
//					if(size<2){//当承办人只有一个人的时候，则进入此步操作
////						if(archUserType.compareTo(ArchDispatch.IS_UNDERTAKE)==0){//为承办
////							if(StringUtils.isNotEmpty(cruArchDepId)&&cruArchDepId.indexOf("$")==-1){
////							   ArchivesDep archivesDep= archivesDepService.get(new Long(cruArchDepId));
////							   StringBuffer sb=new StringBuffer("<div>"+readFeedback);
////							   SimpleDateFormat sdf=new SimpleDateFormat();
////							   sdf.format(new Date());
////							   sb.append("--").append(ContextUtil.getCurrentUser().getFullname()).append("--").append(sdf.format(new Date())).append("</div>");
////							   archivesDep.setHandleFeedback(sb.toString());
////							   archivesDepService.save(archivesDep);
////							}
////						}
//						archives.setStatus(Archives.STATUS_APPLYBACK);
//					}else{//承办人超过两个以上的
//						int recordSize=archDispatchService.countArchDispatch(archives.getArchivesId());
////						if(archUserType.compareTo(ArchDispatch.IS_UNDERTAKE)==0){//为承办
////							if(StringUtils.isNotEmpty(cruArchDepId)&&cruArchDepId.indexOf("$")==-1){
////								   ArchivesDep archivesDep= archivesDepService.get(new Long(cruArchDepId));
////								   StringBuffer sb=new StringBuffer();
////								   if(archivesDep.getHandleFeedback()!=null){
////									   sb.append(archivesDep.getHandleFeedback());
////								   }
////								   sb.append("<div>"+readFeedback);
////								   SimpleDateFormat sdf=new SimpleDateFormat();
////								   sdf.format(new Date());
////								   sb.append("--").append(ContextUtil.getCurrentUser().getFullname()).append("--").append(sdf.format(new Date())).append("</div>");
////								   archivesDep.setHandleFeedback(sb.toString());
////								   archivesDepService.save(archivesDep);
////							}
////						}
//						if(size==recordSize){//当承办意见的记录等于承办人的个数，则结束
//							archives.setStatus(Archives.STATUS_APPLYBACK);
//						}else{//否则还在承办阅读状态
//							archives.setStatus(Archives.STATUS_HANDLING);
//						}
//					}
//				}
//			 archivesService.save(archives);
//			}
//			setJsonString("{success:true}");
//		} else {
//			setJsonString("{success:false}");
//		}
//		return SUCCESS;
//	}

	/**
	 * 反馈意见
	 */
	public String read() {
		ArchDispatch archDispatch = archDispatchService.get(dispatchId);
		if (archDispatch != null) {
			archDispatch.setReadFeedback(readFeedback);
			archDispatch.setIsRead(ArchDispatch.HAVE_READ);
			archDispatch.setDispatchTime(new Date());
			archDispatchService.save(archDispatch);
			setJsonString("{success:true}");
		} else {
			setJsonString("{success:false}");
		}
		return SUCCESS;
	}


	/**
	 * 设置分发人或角色
	 */
	public String dispatch() {
		String disUserIds = getRequest().getParameter("disUserIds");
		String disRoleIds = getRequest().getParameter("disRoleIds");
		Archives archives = archivesService.get(archivesId);
		if (archives != null) {
			if (StringUtils.isNotEmpty(disUserIds)) {
				String[] ids = disUserIds.split(",");
				for (String id : ids) {
					AppUser appUser = appUserService.get(new Long(id));
					ArchDispatch archDispatch = new ArchDispatch();
					archDispatch.setArchives(archives);
					archDispatch.setUserId(appUser.getUserId());
					archDispatch.setFullname(appUser.getFullname());
					archDispatch.setDispatchTime(new Date());
					archDispatch.setSubject(archives.getSubject());
					archDispatch.setIsRead(ArchDispatch.NOT_READ);
					archDispatch.setArchUserType(ArchDispatch.IS_DISPATCH);
					archDispatchService.save(archDispatch);
				}
			}
			if (StringUtils.isNotEmpty(disRoleIds)) {
				String[] ids = disRoleIds.split(",");
				for (String id : ids) {
					AppRole role = appRoleService.get(new Long(id));
					ArchDispatch archDispatch = new ArchDispatch();
					archDispatch.setArchives(archives);
					archDispatch.setDisRoleId(role.getRoleId());
					archDispatch.setDisRoleName(role.getRoleName());
					archDispatch.setDispatchTime(new Date());
					archDispatch.setSubject(archives.getSubject());
					archDispatch.setIsRead(ArchDispatch.NOT_READ);
					archDispatch.setArchUserType(ArchDispatch.IS_DISPATCH);
					archDispatchService.save(archDispatch);
				}
			}
			setJsonString("{success:true}");
		} else {
			setJsonString("{success:false}");
		}
		return SUCCESS;
	}

	/**
	 * 申请为分发人
	 * 
	 * @return
	 */
	public String applicate() {
		ArchDispatch archDispatch = archDispatchService.get(dispatchId);
		if (archDispatch.getUserId() == null) {
			AppUser user = ContextUtil.getCurrentUser();
			archDispatch.setUserId(user.getUserId());
			archDispatch.setFullname(user.getFullname());
			archDispatchService.save(archDispatch);
			setJsonString("{success:true}");
		} else {
			setJsonString("{success:false}");
		}
		return SUCCESS;
	}
}
