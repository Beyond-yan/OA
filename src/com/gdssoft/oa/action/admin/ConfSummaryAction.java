package com.gdssoft.oa.action.admin;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import java.lang.reflect.Type;

import com.gdssoft.oa.model.admin.ConfSummary;
import com.gdssoft.oa.model.admin.Conference;
import com.gdssoft.oa.model.system.AppUser;

import com.gdssoft.oa.service.admin.ConfSummaryService;
import com.gdssoft.oa.service.admin.ConferenceService;
import com.gdssoft.oa.service.system.AppUserService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;

/**
 * @description ConfSummaryAction
 * @author YHZ
 * @date 2010-10-8 PM
 * 
 */
public class ConfSummaryAction extends BaseAction {
	@Resource
	private ConfSummaryService confSummaryService;

	private ConfSummary confSummary;
	private Long sumId;
	private java.util.Date endtime;// 結束日期
	private String fileIds;
	
	private AppUserService appUserService;
	

	private ConferenceService conferenceService;

	

	public String getFileIds() {
		return this.fileIds;
	}

	public void setFileIds(String fileIds) {
		this.fileIds = fileIds;
	}

	public java.util.Date getEndtime() {
		return endtime;
	}

	public void setEndtime(java.util.Date endtime) {
		this.endtime = endtime;
	}

	public Long getSumId() {
		return sumId;
	}

	public void setSumId(Long sumId) {
		this.sumId = sumId;
	}

	public ConfSummary getConfSummary() {
		return confSummary;
	}

	public void setConfSummary(ConfSummary confSummary) {
		this.confSummary = confSummary;
	}

	public ConferenceService getConferenceService() {
		return conferenceService;
	}

	public void setConferenceService(ConferenceService conferenceService) {
		this.conferenceService = conferenceService;
	}

	/**
	 * 显示列表
	 */
	public String list() {
		//用于会议纪要管理页面，管理员以及创建会议纪要的当事人查询
		AppUser user=ContextUtil.getCurrentUser();	
		SimpleDateFormat sdf = new SimpleDateFormat("yyy-MM-dd HH:mm:ss");
		QueryFilter filter = new QueryFilter(getRequest());
		if (endtime != null)
			{filter.addFilter("Q_createtime_D_LE", sdf.format(endtime));}
		
		int isManage=confSummaryService.searchUsr_Role(user.getUserId());

		if(isManage<1){
		//如果不是管理员则插入查询条件
		    filter.addFilter("Q_creator_S_EQ",user.getUsername() );		    
		}
		List<ConfSummary> list = confSummaryService.getAll(filter);
		Type type = new TypeToken<List<ConfSummary>>() {
		}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");

		Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss")
				.create();
		buff.append(gson.toJson(list, type));
		buff.append("}");

		jsonString = buff.toString();

		return SUCCESS;
	}
	
	
	/**
	 * 显示与我相关会议的纪要列表
	 */
	public String searchJoinMe() {

		int countTemp=0;
		//用于会议纪要查询页面，管理员以及会议相关人员查询
		AppUser user=ContextUtil.getCurrentUser();	
		SimpleDateFormat sdf = new SimpleDateFormat("yyy-MM-dd HH:mm:ss");
		QueryFilter filter = new QueryFilter(getRequest());
		if (endtime != null)
			{filter.addFilter("Q_createtime_D_LE", sdf.format(endtime));}

		int isManage=confSummaryService.searchUsr_Role(user.getUserId());

		List<ConfSummary> list=confSummaryService.getAll(filter);
		if(isManage<1){
		//如果不是管理员则插入查询条件
			//filter.addFilter("Q_creator_S_EQ",user.getUsername() );	
			
			//List<ConfSummary> list = confSummaryService.getAll(filter);

		for(int i=0;i<list.size();i++){
			//confSummary2.getConfId()
			ConfSummary confSummary2;
			confSummary2=list.get(i);
              Long confId3=confSummary2.getConfId().getConfId();
			int sum1=confSummaryService.searchConfAt_Summary(user.getUserId(), confId3);
			if(sum1<1){
				list.remove(i);
				countTemp++;
			}
			
		}	//filter.addFilter("Q_creator_S_EQ",user.getUsername() );	
			
		}
		

		Type type = new TypeToken<List<ConfSummary>>() {
		}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()-countTemp).append(
						",result:");

		Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss")
				.create();
		buff.append(gson.toJson(list, type));
		buff.append("}");

		jsonString = buff.toString();

		return SUCCESS;
	}


	/**
	 * 批量删除
	 */
	public String multiDel() {
		try{
		Conference conference1;
		AppUser appuser1;
		String[] ids = getRequest().getParameterValues("ids");
		String[] confIds = getRequest().getParameterValues("confIds");
		if (ids != null) {
			for (String id : ids) {
				confSummaryService.remove(new Long(id));
			}
		}
		if(confIds!=null){
			for(String confId1: confIds){
			Conference orgConference =conferenceService.get(new Long(confId1));
			conference1=new Conference();
			appuser1 = new AppUser();
			appuser1 = ContextUtil.getCurrentUser();
			conference1.setUpdateBy(appuser1.getFullname());
			conference1.setUpdateDate(new Date());
			conference1.setStatus((short)0);//4表示该笔会议纪要已经被创建，0表示会议纪要尚未被创建
			BeanUtil.copyNotNullProperties(orgConference, conference1);
			 conferenceService.save(orgConference);	
			}
		}
		
		jsonString = "{success:true}";
		}
		catch(Exception e){
			
			setJsonString("{failure:true,msg:'对不起，删除异常，请确认后重试！'}");
			e.printStackTrace();
			
		}
		return SUCCESS;
	}

	/**
	 * @description 单条数据删除
	 */
	public String del() {
		String id = getRequest().getParameter("sumId");
		confSummaryService.remove(new Long(id));
		jsonString = "{success:true}";
		return SUCCESS;
	}

	/**
	 * @description 显示详细信息
	 */
	public String get() {
		ConfSummary confSummary = confSummaryService.get(sumId);
		Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss")
				.create();
		// 将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(confSummary));
		sb.append("}");
		setJsonString(sb.toString());

		return SUCCESS;
	}

	/**
	 * @description 发送
	 */
	public String send() {
		String content = confSummary.getSumContent();
		if (content == null || content.isEmpty() || content.equals(" ")) {
			setJsonString("{failure:true,msg:'读不起，会议纪要内容不能为空，请输入！'}");
		} else {
			confSummary.setCreatetime(new java.util.Date());
			confSummary.setCreator(ContextUtil.getCurrentUser().getUsername());
			confSummary.setStatus((short) 1);
			confSummaryService.send(confSummary, fileIds);
			setJsonString("{success:true}");
		}
		return SUCCESS;
	}

	/**
	 * 添加
	 */
	public String save() {
		try{
		AppUser appuser1=ContextUtil.getCurrentUser();
		Conference conference1;
		String content = confSummary.getSumContent();
		if (content == null || content.isEmpty() || content.equals(" ")) {
			setJsonString("{failure:true,msg:'对不起，会议纪要内容不能为空，请重新输入！'}");
		} else {
			confSummary.setCreatetime(new java.util.Date());
			confSummary.setCreator(appuser1.getUsername());
			confSummary.setStatus((short) 0);
			confSummary.setCreateBy(appuser1.getUsername());
			confSummary.setCreateDate(new Date());
			confSummaryService.save(confSummary, fileIds);
			Long confId1=confSummary.getConfId().getConfId();
			if(confId1!=null){
		Conference orgConference =conferenceService.get(confId1);
		conference1=new Conference();
		
		conference1.setUpdateBy(appuser1.getFullname());
		conference1.setUpdateDate(new Date());
		conference1.setStatus((short)4);//4表示该笔会议纪要已经被创建，0表示会议纪要尚未被创建
		BeanUtil.copyNotNullProperties(orgConference, conference1);
		 conferenceService.save(orgConference);					
			}			
			setJsonString("{success:true}");
		}
		}
		catch(Exception e){
			
			setJsonString("{failure:true,msg:'对不起，出现异常，请重新输入！'}");
		}
		
		
		return SUCCESS;
	}

	/**
	 * @description 编辑保存
	 */
	public String edit() {
		//AppUser user=ContextUtil.getCurrentUser();	
		//confSummary.setUpdateBy(user.getUsername());
		confSummary.setUpdateDate(new Date());
		confSummary.setStatus((short)0);//0表示未删除
		confSummaryService.save(confSummary, fileIds);
		setJsonString("{success:true}");
		return SUCCESS;
	}

	/**
	 * @description 当前用户的纪要信息
	 */
	public String display() {
		QueryFilter filter = new QueryFilter(getRequest());
		filter.addFilter("Q_status_SN_EQ", "1");
		filter.addSorted("createtime", "DESC");
		List<ConfSummary> list = confSummaryService.getAll(filter);
		for (int i = 0; i < list.size(); i++) {
			ConfSummary cm = list.get(i);
			Conference cf = cm.getConfId();
			if (cm.getStatus() != 1
					&& (myConfSummary(cf.getCompere())
							&& myConfSummary(cf.getRecorder()) && myConfSummary(cf
							.getAttendUsers()))) {
				list.remove(i);
			}
			if (i > 7) { //保证8条数据显示
				for (int j = 8; j < list.size(); j++)
					list.remove(j);
			}
		}
		getRequest().setAttribute("confSummaryList", list);
		return "display";
	}

	/**
	 * @description 判断是否为我的会议纪要,true不是的
	 */
	private boolean myConfSummary(String str) {
		boolean bo = true; // 默认不是的
		Long userId = ContextUtil.getCurrentUserId();
		int index = str.indexOf(userId.toString());
		if (index > 1 && str.substring(index - 1, index).equals(","))
			bo = false;
		else if (index == 0)
			bo = false;
		return bo;
	}

}
