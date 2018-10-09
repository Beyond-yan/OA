package com.gdssoft.oa.action.meeting;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.leaderActivities.LeaderActivities;
import com.gdssoft.oa.model.meeting.MeetingToDo;
import com.gdssoft.oa.model.meeting.OutMeeting;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.FileAttach;
import com.gdssoft.oa.model.system.SysConfig;
import com.gdssoft.oa.service.communicate.SmsMobileService;
import com.gdssoft.oa.service.leaderActivities.LeaderActivitiesService;
import com.gdssoft.oa.service.meeting.OutMeetingService;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.oa.service.system.FileAttachService;
import com.gdssoft.oa.service.system.SysConfigService;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class OutMeetingAction extends BaseAction{
	
	@Resource
	private FileAttachService fileAttachService;
	@Resource
	private OutMeetingService outMeetingService;
	@Resource
	private SmsMobileService smsMobileService;
	@Resource
	private AppUserService appUserService;
	@Resource
	private LeaderActivitiesService leaderActivitiesService;
	@Resource
	private SysConfigService sysConfigService;
	
	private OutMeeting outMeeting;
	
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public OutMeeting getOutMeeting() {
		return outMeeting;
	}

	public void setOutMeeting(OutMeeting outMeeting) {
		this.outMeeting = outMeeting;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<OutMeeting> list= outMeetingService.getAll(filter);
		
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		JSONSerializer json = new JSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd HH:mm"));
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");

		
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	
	/**
	 * 显示列表
	 */
	public String listFlow(){
		String toDoType=getRequest().getParameter("toDoType");
		String holdDep = getRequest().getParameter("holdDep");
		String meetingName = getRequest().getParameter("meetingName");
		String startDate = getRequest().getParameter("startDate");
		String endDate = getRequest().getParameter("endDate");
		String start = getRequest().getParameter("start");
		String limit = getRequest().getParameter("limit");
		String attendUsers = getRequest().getParameter("attendUsers");
		
		List<MeetingToDo> list= outMeetingService.getNewFlowTaskList(ContextUtil.getCurrentUserId(), Integer.parseInt(toDoType)
				,meetingName,attendUsers, holdDep, startDate, endDate, Integer.parseInt(start), Integer.parseInt(limit));
		
		int totalCounts = 0;
		if(null != list && list.size() >0 ) totalCounts = list.get(0).getTotalCounts();
		
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':").append(totalCounts).append(",result:");
		
		JSONSerializer json = new JSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd HH:mm"), new String[] {"holdTime"});
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");
		
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	
	/**
	 * 批量删除
	 * @return
	 */
	public String multiDel(){
		
		String[]ids=getRequest().getParameterValues("ids");
		if(ids!=null){
			for(String id:ids){
				outMeetingService.remove(new Long(id));
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
		OutMeeting outMeeting=outMeetingService.get(id);

		JSONSerializer json = new JSONSerializer();
		json.transform(new DateTransformer("yyyy年MM月dd日 HH时mm分"),new String[] {"holdTime"});
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(json.exclude(new String[] { "class" }).serialize(outMeeting));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	
	
	/**
	 * 添加及保存操作
	 */
	public String save(){
		String holdDt = getRequest().getParameter("holdDt");
		if(holdDt!=null && !"".equals(holdDt)){
			try {
				outMeeting.setHoldTime(new SimpleDateFormat("yyyy-MM-dd HH:mm").parse(holdDt));
			} catch (ParseException e) {
				e.printStackTrace();
				setJsonString("{success:false}");
				return SUCCESS;
			}
		}
		
		if(outMeeting.getMeetingId()==null){
			outMeetingService.save(outMeeting);
		}else{
			OutMeeting orgOutMeeting = outMeetingService.get(outMeeting.getMeetingId());
			orgOutMeeting.getDocs().addAll(outMeeting.getDocs());
			outMeeting.setDocs(orgOutMeeting.getDocs());
			try{
				BeanUtil.copyNotNullProperties(orgOutMeeting, outMeeting);
				outMeeting = orgOutMeeting;
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}
		
		
		String docIdStrs = getRequest().getParameter("docIds");
		if (docIdStrs != null && !"".equals(docIdStrs)) {
			for (Iterator<FileAttach> it = (Iterator<FileAttach>) outMeeting.getDocs().iterator();it.hasNext();) {
				outMeeting.getDocs().remove(it);
			}
			for (String id : docIdStrs.split(",")) {
				FileAttach fa = fileAttachService.get(new Long(id));
				outMeeting.getDocs().add(fa);
			}
		}

		outMeeting = outMeetingService.save(outMeeting);
		
//		String leaderIds = getRequest().getParameter("leaderIds");
//		String isStart = getRequest().getParameter("isStart");
//		if ("true".equals(isStart)&&leaderIds != null && !"".equals(leaderIds)) {
//			//pushToLeaderSchedule(outMeeting,leaderIds);//
//			
//			String content = "委领导"+outMeeting.getAttendLeaders()+",将于"+holdDt+"，参加由"+outMeeting.getHoldDep()+"召开的"+outMeeting.getName()+"，请知悉。委办公室。";
//			SysConfig sc = sysConfigService.findDataValueByTkCkey("smsServiceConfig", "ZhuRenRoleId");
//			String roleId = sc.getDataValue();
//			List<AppUser> list = appUserService.findByRoleId(new Long(roleId));
//			String uids = "";
//			for (AppUser appUser : list) {
//				uids += appUser.getUserId()+",";
//			}
//			if(StringUtils.isNotEmpty(uids)){
//				smsMobileService.saveSms(uids, content);
//			}
//			
//		}
		
		
		
		setJsonString("{success:true,meetingId:"+outMeeting.getMeetingId()+"}");
		return SUCCESS;
		
	}
	/**
	 * 添加及保存操作
	 */
	public String fillRunId(){
		outMeeting = outMeetingService.fillRunId(outMeeting);
		setJsonString("{success:"+(outMeeting==null)+"}");
		return SUCCESS;
	}
	
	/**
	 * 处室承办员填写发送手机通知相关领导
	 */
	public String notice(){
		String userIds = getRequest().getParameter("uids");
		String content = getRequest().getParameter("content");
		
		if(content!=null && content.length() > 0){
			smsMobileService.saveSms(userIds, content);
		}
		return SUCCESS;
	}
	
	/**
	 * 讲外来会议信息推送到领导日程
	 * @param outMeeting
	 * @param leaderIds
	 */
	private void pushToLeaderSchedule(OutMeeting outMeeting,String leaderIds) {
		
		String context = "到"+outMeeting.getHoldLocation()+"出席，由"+outMeeting.getHoldDep()+"主办的"+outMeeting.getName();
		
		Date holdTime = outMeeting.getHoldTime();
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		Date endTime = null;
		try {
			endTime = sdf.parse(sdf.format(holdTime).substring(0, 10) + " 18:00");
		} catch (ParseException e) {
			e.printStackTrace();
		}
		
		int timeType = 0;
		if(holdTime.getHours()>12){
			timeType = 1;
		}else if(holdTime.getHours()<10){
			timeType = 2;
		}
		
		String un = ContextUtil.getCurrentUser().getFullname();
		
		for(String userId : leaderIds.split(",")){
			AppUser au = appUserService.get(Long.parseLong(userId));
			if(au != null){
				LeaderActivities leaderActivities = new LeaderActivities();
				leaderActivities.setActiveName(context);
				leaderActivities.setAppUser(au);
				leaderActivities.setStartTime(holdTime);
				leaderActivities.setEndTime(endTime);
				leaderActivities.setTimeNumber(1);
				leaderActivities.setTimeType(timeType);
				leaderActivities.setCreateDate(new Date());
				leaderActivities.setCreateUser(un);
				leaderActivitiesService.save(leaderActivities);
			}
		}
	}
	
	
	/**
	 * 终止流程并删除该流程相关代办
	 * @author 
	 * @return
	 */
	public String cancelFlow(){
		boolean success = outMeetingService.cancelFlow(getRequest());
		System.out.println("-----SUCCESS:"+success);
		return SUCCESS;
	}
}

