package com.gdssoft.oa.action.archive;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.model.archive.OdCirPaper;
import com.gdssoft.oa.model.archive.OdCirUser;
import com.gdssoft.oa.model.flow.ProcessRun;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.archive.OdCirPaperService;
import com.gdssoft.oa.service.archive.OdCirUserService;
import com.gdssoft.oa.service.flow.ProcessRunService;
import com.gdssoft.oa.service.system.AppUserService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;

/**
 * 
 * @author
 * 
 */
public class OdCirUserAction extends BaseAction {
	@Resource
	private OdCirUserService odCirUserService;
	@Resource
	private OdCirPaperService odCirPaperService;
	private OdCirUser odCirUser; 
	@Resource
	private AppUserService appUserService;

	@Resource
	private ProcessRunService processRunService;
	private Long cirUserId;

	public Long getCirUserId() {
		return cirUserId;
	}

	public void setCirUserId(Long cirUserId) {
		this.cirUserId = cirUserId;
	}

	public OdCirUser getOdCirUser() {
		return odCirUser;
	}

	public void setOdCirUser(OdCirUser odCirUser) {
		this.odCirUser = odCirUser;
	}

	/**
	 * 显示列表
	 */
	public String list() {

		QueryFilter filter = new QueryFilter(getRequest());
		List<OdCirUser> list = odCirUserService.getAll(filter);

		Type type = new TypeToken<List<OdCirUser>>() {
		}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");

		Gson gson = new Gson();
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

		String[] ids = getRequest().getParameterValues("ids");
		if (ids != null) {
			for (String id : ids) {
				odCirUserService.remove(new Long(id));
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
		OdCirUser odCirUser = odCirUserService.get(cirUserId);

		Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		// 将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(odCirUser));
		sb.append("}");
		setJsonString(sb.toString());

		return SUCCESS;
	}

	/**
	 * 添加及保存操作
	 */
	public String save() {
		if (odCirUser.getCirUserId() == null) {
			odCirUserService.save(odCirUser);
		} else {
			odCirUser.setIsRead((short) 1);
			odCirUser.setReadDate(new Date());
			OdCirUser orgOdCirUser = odCirUserService.get(odCirUser
					.getCirUserId());
			try {
				BeanUtil.copyNotNullProperties(orgOdCirUser, odCirUser);
				odCirUserService.save(orgOdCirUser);
			} catch (Exception ex) {
				logger.error(ex.getMessage());
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;

	}

	public String update() {
		String taskId = getRequest().getParameter("taskId");
		Long runId = odCirUserService.getRunIdByTadkId(new Long(taskId));
		AppUser currentUser = ContextUtil.getCurrentUser();
		List<Long> cirUserIdList = odCirUserService.getByUserAndRun(runId, currentUser
				.getUserId());
		for(int i=0;i<cirUserIdList.size();i++){
		OdCirUser orgOdCirUser = odCirUserService.get(cirUserIdList.get(i));
		orgOdCirUser.setIsRead((short) 1);
		orgOdCirUser.setReadDate(new Date());
		odCirUserService.save(orgOdCirUser);
		}
		setJsonString("{success:true,cirUserId:'" + cirUserIdList.get(0) + "'}");
		return SUCCESS;
	}

	/**
	 * 启动传阅子流程
	 * 
	 * @return
	 */
	public String startSub() {
		// 接受执行人相关参数
		String defId = getRequest().getParameter("defId");
		String recIds = getRequest().getParameter("recIds");
		String cirUserId = getRequest().getParameter("cirUserId");
		String processName = getRequest().getParameter("processName");
		String startNodeName = getRequest().getParameter("startNodeName");
		String cirPaId = getRequest().getParameter("cirPaperId");
		Long createuserId = Long.valueOf(getRequest().getParameter("userId"));
		AppUser createUser = appUserService.get(createuserId);
		OdCirUser oldOdCirUser = odCirUserService.get(new Long(cirUserId));

		Long cirPaperId = new Long(cirPaId);

		OdCirPaper odCirPaper = odCirPaperService.get(cirPaperId);

		String[] newUserIds = recIds.split(",");
		String runId = odCirPaperService.startCirSubFlow(Long.valueOf(defId),
				odCirPaper, processName, startNodeName, recIds, createUser);
		ProcessRun processRun = processRunService.get(new Long(runId));
		processRun.setSubject(odCirPaper.getSubject());
		processRunService.save(processRun);
		for (String userId : newUserIds) {
			// 启动子流程实例 得到流程实例ID
			if (null != runId) {// 如果启动流程成功
				// 新增子流程并更新数据的流程实例ID
				
				OdCirUser odCirUser = new OdCirUser();
				odCirUser.setSendUserId(createUser.getUserId());
				odCirUser.setRecUserId(new Long(userId));
				odCirUser.setOdCirPaper(odCirPaper);
				odCirUser.setIsRead((short) 0);
				odCirUser.setProcessRun(processRun);
				odCirUser = odCirUserService.save(odCirUser);
				odCirUser.setPath(oldOdCirUser.getPath()+ odCirUser.getCirUserId().toString()+".");
				odCirUser = odCirUserService.save(odCirUser);
			}
		}
		setJsonString("{success:true}");
		return SUCCESS;
	}

	/**
	 * @author F3225932 
	 * @category 根据条件查询传阅件列表
	 * @return
	 */
	public String searchSender() {
		String subject = getRequest().getParameter("subject");
		String senderName = getRequest().getParameter("senderName");
		String isRead = getRequest().getParameter("isRead");
		String recName = getRequest().getParameter("recName");
		PagingBean pb = getInitPagingBean();
		AppUser currentUser = ContextUtil.getCurrentUser();
		/*List<OdCirUser> cirUserList = odCirUserService.searchBySender(
				currentUser.getUserId(), subject, senderName, recName, isRead,
				pb);*/
		List<OdCirPaper> cirPaperList = odCirPaperService.searchBySender(
				currentUser.getUserId(), subject, senderName, recName, isRead,
				pb);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(pb.getTotalItems()).append(",result:");
		
//		JSONSerializer serializer = new JSONSerializer();
//		serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm"),
//				"readDate");
//		buff.append(serializer.exclude(new String[] { "class" }).serialize(
//				cirUserList));
		buff.append("[");
		for(int i=0;i<cirPaperList.size();i++){	
			if((i!=0)){
				buff.append(",");
			}
		  buff.append("{'cirPaperId':"+cirPaperList.get(i).getCirPaperId());
		  buff.append(",");
		  buff.append("'subject':"+"'"+cirPaperList.get(i).getSubject()+"'");
		  buff.append("}");
		}
		buff.append("]}");
		jsonString = buff.toString();
		return SUCCESS;
	}
	
	/**
	 * @author F3225932 20121018
	 * @category 根据传阅件的paperId查询传阅件
	 * @return
	 */
	public String searchByPaperId() {		
		String cirPaperId = getRequest().getParameter("cirPaperId");
		PagingBean pb = getInitPagingBean();
		AppUser currentUser = ContextUtil.getCurrentUser();
		List<OdCirUser> cirUserList = odCirUserService.searchByPaperId(
				currentUser.getUserId(),new Long(cirPaperId),pb);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(pb.getTotalItems()).append(",result:");
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm"),
				"readDate");
		buff.append(serializer.exclude(new String[] { "class" }).serialize(
				cirUserList));
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
	}
}
