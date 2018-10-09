package com.gdssoft.oa.action.meetingNotice;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.JsonUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.flow.FlowTaskReport;
import com.gdssoft.oa.model.flow.JbpmTask;
import com.gdssoft.oa.model.leaderActivities.LeaderActivities;
import com.gdssoft.oa.model.meetingNotice.MeetingNotice;
import com.gdssoft.oa.model.meetingNotice.MeetingNoticeToDo;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.FileAttach;
import com.gdssoft.oa.service.communicate.SmsMobileService;
import com.gdssoft.oa.service.flow.ProcessFormService;
import com.gdssoft.oa.service.leaderActivities.LeaderActivitiesService;
import com.gdssoft.oa.service.meetingNotice.MeetingNoticeService;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.oa.service.system.FileAttachService;
import com.gdssoft.oa.service.system.SysConfigService;
import com.gdssoft.oa.util.BeanToMapUtil;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class MeetingNoticeAction extends BaseAction{
	
	@Resource
	private FileAttachService fileAttachService;
	@Resource
	private MeetingNoticeService meetingNoticeService;
	@Resource
	private SmsMobileService smsMobileService;
	@Resource
	private AppUserService appUserService;
	@Resource
	private LeaderActivitiesService leaderActivitiesService;
	@Resource
	private SysConfigService sysConfigService;
	@Resource
	private ProcessFormService processFormService;
	
	private MeetingNotice meetingNotice;
	
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public MeetingNotice getMeetingNotice() {
		return meetingNotice;
	}

	public void setMeetingNotice(MeetingNotice meetingNotice) {
		this.meetingNotice = meetingNotice;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<MeetingNotice> list= meetingNoticeService.getAll(filter);
		
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
		String subject = getRequest().getParameter("subject");
		String startDate = getRequest().getParameter("startDate");
		String endDate = getRequest().getParameter("endDate");
		String start = getRequest().getParameter("start");
		String limit = getRequest().getParameter("limit");
		String schemaCode = ContextUtil.getCurrentUser().getOwnerSchema();
		
		List<MeetingNoticeToDo> list= meetingNoticeService.getNewFlowTaskList(ContextUtil.getCurrentUserId(), Integer.parseInt(toDoType)
				,subject, holdDep, startDate, endDate, Integer.parseInt(start), Integer.parseInt(limit));
		
		List<Map<String, Object>> mapList = new ArrayList<Map<String,Object>>();
		try {
			mapList = BeanToMapUtil.convertListBean2ListMap(list, MeetingNoticeToDo.class);
		} catch (Exception e) {
			e.printStackTrace();
		}
		for(Map<String, Object> object : mapList){
			Long runId = Long.parseLong(object.get("runId").toString());
			Map processRunVars = processFormService.getVariables(runId,schemaCode);
			object.putAll(processRunVars);
		}
		
		int totalCounts = 0;
		if(null != list && list.size() >0 ) totalCounts = list.get(0).getTotalCounts();
		
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':").append(totalCounts).append(",result:");
		
		JSONSerializer json = new JSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"), new String[] {"meetingDate"});
		buff.append(json.exclude(new String[] { "class" }).serialize(mapList));
		buff.append("}");
		
		jsonString=buff.toString();
		
		return SUCCESS;
	}

	/**
	 * 显示参加会议列表
	 */
	public String listAttendMeeting(){
		String holdDep = getRequest().getParameter("holdDep");
		String subject = getRequest().getParameter("subject");
		String startDate = getRequest().getParameter("startDate");
		String endDate = getRequest().getParameter("endDate");
		String start = getRequest().getParameter("start");
		String limit = getRequest().getParameter("limit");
		String schemaCode = ContextUtil.getCurrentUser().getOwnerSchema();
		
		List<MeetingNoticeToDo> list= meetingNoticeService.listAttendMeeting(ContextUtil.getCurrentUserId()
				,subject, holdDep, startDate, endDate, Integer.parseInt(start), Integer.parseInt(limit));
		
		int totalCounts = 0;
		if(null != list && list.size() >0 ) totalCounts = list.get(0).getTotalCounts();
		
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':").append(totalCounts).append(",result:");
		
		JSONSerializer json = new JSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"), new String[] {"meetingDate"});
		buff.append(json.exclude(new String[] { "class" }).serialize(list));
		buff.append("}");
		
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	
	/**
	 * 桌面会议通知
	 */
	public String display(){
		List<MeetingNoticeToDo> list= meetingNoticeService.getNewFlowTaskList(ContextUtil.getCurrentUserId(), 0
				,null, null, null, null, 0, 8);
		
		getRequest().setAttribute("viewList", list);
		
		return "display";
	}
	
	/**
	 * 显示详细信息
	 * @return
	 */
	public String get(){
		MeetingNotice meetingNotice=meetingNoticeService.get(id);

		JSONSerializer json = new JSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"),new String[] {"meetingDate"});
		StringBuffer sb = new StringBuffer("{success:true,data:[");
		sb.append(json.exclude(new String[] { "class" }).serialize(meetingNotice));
		sb.append("]}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	
	
	/**
	 * 添加及保存操作
	 */
	public String save(){
		
		if(meetingNotice.getNoticeId()==null){
			meetingNotice.setCreateDep(ContextUtil.getCurrentUser().getDepartment().getDepName());
			meetingNotice.setCreateDepId(ContextUtil.getCurrentUser().getDepartment().getDepId());
			meetingNotice.setCreateTime(new Date());
			meetingNotice.setCreator(ContextUtil.getCurrentUser().getFullname());
			meetingNotice.setCreatorId(ContextUtil.getCurrentUserId());
			meetingNoticeService.save(meetingNotice);
		}else{
			MeetingNotice orgMeetingNotice = meetingNoticeService.get(meetingNotice.getNoticeId());
			orgMeetingNotice.getDocs().addAll(meetingNotice.getDocs());
			meetingNotice.setDocs(orgMeetingNotice.getDocs());
			try{
				BeanUtil.copyNotNullProperties(orgMeetingNotice, meetingNotice);
				meetingNotice = orgMeetingNotice;
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}
		
		meetingNotice.setDocs(new HashSet<FileAttach>());
		String docIdStrs = getRequest().getParameter("docIds");
		if (docIdStrs != null && !"".equals(docIdStrs)) {
			for (String id : docIdStrs.split(",")) {
				FileAttach fa = fileAttachService.get(new Long(id));
				meetingNotice.getDocs().add(fa);
			}
		}

		meetingNotice = meetingNoticeService.save(meetingNotice);
		
		
		
		setJsonString("{success:true,noticeId:"+meetingNotice.getNoticeId()+"}");
		return SUCCESS;
		
	}
	
	/**
	 * 添加及保存操作
	 */
	public String updateMainDep(){
		String noticeId = getRequest().getParameter("noticeId");
		String mainDepId = getRequest().getParameter("mainDepId");
		String mainDep = getRequest().getParameter("mainDep");
		MeetingNotice meetingNotice = meetingNoticeService.get(Long.parseLong(noticeId));
		meetingNotice.setMainDep(mainDep);
		meetingNotice.setMainDepId(Long.parseLong(mainDepId));
		meetingNotice = meetingNoticeService.save(meetingNotice);
		
		setJsonString("{success:true,noticeId:"+meetingNotice.getNoticeId()+"}");
		return SUCCESS;
		
	}
	
	//删除正文
	public String multiDelDoc(){
		String fileIds = getRequest().getParameter("ids");
		for (String id : fileIds.split(",")) {
			fileAttachService.remove(new Long(id));
		}
		return SUCCESS;
	}
	
	/**
	 * 获取正文
	 * @return
	 */
	public String getDocs(){
		String noticeId = getRequest().getParameter("noticeId");
		MeetingNotice meetingNotice=meetingNoticeService.get(Long.parseLong(noticeId));
		
		StringBuffer buff = new StringBuffer("{\"success\":\"true\",\"totalCounts\":")
		.append(meetingNotice.getDocs().size()).append(
				",\"result\":");

		JSONSerializer json = new JSONSerializer();
		buff.append(json.serialize(meetingNotice.getDocs()));
		buff.append("}");
		setJsonString(buff.toString());
		
		return SUCCESS;
	}

	/**
	 * 完成车辆信息等
	 */
	public String completeInfo(){
		
		String noticeId = getRequest().getParameter("noticeId");
		String departureTime = getRequest().getParameter("departureTime");
		String departurePlace = getRequest().getParameter("departurePlace");
		String vehicleInfo = getRequest().getParameter("vehicleInfo");
		String driverInfo = getRequest().getParameter("driverInfo");
		String attendPersonsId = getRequest().getParameter("attendPersonsId");
		String attendPersonsName = getRequest().getParameter("attendPersonsName");
		String curDepId = ContextUtil.getCurrentUser().getDepartment().getDepId().toString();
		String curDepName = ContextUtil.getCurrentUser().getDepartment().getDepName();
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		
		MeetingNotice oldMeetingNotice = meetingNoticeService.get(Long.parseLong(noticeId));
		if(oldMeetingNotice != null){
			if(StringUtils.isNotEmpty(departurePlace)){
				oldMeetingNotice.setDeparturePlace(departurePlace);
			}
			if(StringUtils.isNotEmpty(departureTime)){
				try {
					oldMeetingNotice.setDepartureTime(dateFormat.parse(departureTime));
				} catch (ParseException e) {
					e.printStackTrace();
				}
			}
			if(StringUtils.isNotEmpty(vehicleInfo)){
				oldMeetingNotice.setVehicleInfo(vehicleInfo);
			}
			if(StringUtils.isNotEmpty(driverInfo)){
				oldMeetingNotice.setDriverInfo(driverInfo);
			}

			String oldAttendPersonsId = oldMeetingNotice.getAttendPersons() == null ? "" : oldMeetingNotice.getAttendPersons();
			String oldAttendPersonsName = oldMeetingNotice.getAttendPersonsName() == null ? "" : oldMeetingNotice.getAttendPersonsName();
			List<String> attendPersonsList = new ArrayList<String>();
			List<String> attendPersonsNameList = new ArrayList<String>();
			if(StringUtils.isNotEmpty(oldAttendPersonsId)){
				attendPersonsList.addAll(Arrays.asList(oldAttendPersonsId.split("；")));
				attendPersonsNameList.addAll(Arrays.asList(oldAttendPersonsName.split("；")));
			}
			for(int i = 0; i < attendPersonsList.size(); i++){
				if(attendPersonsList.get(i).indexOf(curDepId) > -1){
					attendPersonsList.remove(i);
					attendPersonsNameList.remove(i);
					break;
				}
			}
			if(StringUtils.isNotEmpty(attendPersonsId)){
				attendPersonsList.add(curDepId + "：" + attendPersonsId);
				attendPersonsNameList.add(curDepName + "：" + attendPersonsName);
			}
			oldMeetingNotice.setAttendPersons(StringUtils.join(attendPersonsList.iterator(), "；"));
			oldMeetingNotice.setAttendPersonsName(StringUtils.join(attendPersonsNameList.iterator(), "；"));

			meetingNotice = meetingNoticeService.save(oldMeetingNotice);
		}
		
		
		setJsonString("{success:true}");
		return SUCCESS;
		
	}
	/**
	 * 添加及保存操作
	 */
	public String updateRunId(){
		meetingNotice = meetingNoticeService.updateRunId(meetingNotice);
		setJsonString("{success:"+(meetingNotice==null)+"}");
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
	 * 终止流程并删除该流程相关代办
	 * @author 
	 * @return
	 */
	public String cancelFlow(){
		boolean success = meetingNoticeService.cancelFlow(getRequest());
		System.out.println("-----SUCCESS:"+success);
		return SUCCESS;
	}
	
	/**
	 * 
	 * 发送短信获取领导信息
	 * @return
	 */
	public String getLeaderInfo(){
		String noticeId=getRequest().getParameter("noticeId");
		MeetingNotice meetingNotice = meetingNoticeService.get(Long.parseLong(noticeId));
		String leaderIds = meetingNotice.getAttendLeaders(); 
		List<AppUser> appUsers = new ArrayList<AppUser>();
		if(StringUtils.isNotEmpty(leaderIds)){
			for(String leaderId : leaderIds.split(",")){
				appUsers.add(appUserService.get(Long.parseLong(leaderId)));
			}
		}
		JSONSerializer json = new JSONSerializer();
		getRequest().setAttribute("meetingNotice", json.serialize(meetingNotice));
		getRequest().setAttribute("appUsers",json.serialize(appUsers));
		return "leadDisplay";
	}
	
	/**
	 * 
	 * 处室默认发送短信
	 * @return
	 */
	public String autoSendSmsForDep(){
		String noticeId=getRequest().getParameter("noticeId");
		String personIdsStr=getRequest().getParameter("personIds");
		AppUser user = ContextUtil.getCurrentUser();
		String schemaCode=user.getOwnerSchema();
		String[] personIds = personIdsStr.split(",");
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		String curDateStr = sdf.format(new Date());
		MeetingNotice meetingNotice = meetingNoticeService.get(Long.parseLong(noticeId));
		for(String personId : personIds){
			AppUser appUser = appUserService.get(Long.parseLong(personId));
			if (appUser.getMobile() != null) {
				String content = "会议通知待办提醒:ＯＡ系统于"+curDateStr+"给您发送了一条会议通知待办事项："+"\""+meetingNotice.getSubject()+"\""+"，请您尽快处理。--系统自动发送";
				System.out.println("content:"+content);
				smsMobileService.saveSms(String.valueOf(appUser.getUserId()),content);
			}
		}
		return SUCCESS;
	}
	/**
	 * 
	 * 领导发送短信
	 * @return
	 */
	public String sendSmsForLeader(){
		String leadersStr=getRequest().getParameter("leaders");
		String smsContent=getRequest().getParameter("smsContent");
		AppUser user = ContextUtil.getCurrentUser();
		String[] leaders = leadersStr.split(",");
		for(String leader : leaders){
			AppUser appUser = appUserService.get(Long.parseLong(leader));
			if (appUser.getMobile() != null) {
				System.out.println("content:"+smsContent);
				smsMobileService.saveSms(String.valueOf(appUser.getUserId()),smsContent);
			}
		}
		return SUCCESS;
	}
	
	/**
	 * 
	 * 更新处室参会人员日程
	 * @return
	 */
	public String syncMeetingToActiveForDep(){
		String noticeId=getRequest().getParameter("noticeId");
		String personIdsStr=getRequest().getParameter("personIds");
		AppUser user = ContextUtil.getCurrentUser();
		String schemaCode=user.getOwnerSchema();
		String[] personIds = personIdsStr.split(",");
		List<LeaderActivities>  leaderActivities = leaderActivitiesService.findActiveByNoticeIdAndDepId(schemaCode, Long.parseLong(noticeId), user.getDepartment().getDepId());
		for(LeaderActivities leaderActivitie : leaderActivities){
			leaderActivitiesService.removeArchivesActive(schemaCode,leaderActivitie.getActiveId());
			leaderActivitiesService.remove(leaderActivitie);
		}
		for(String personId : personIds){
			LeaderActivities activities = new LeaderActivities();
			activities.setActiveDesc(meetingNotice.getMeetingPlace());
			activities.setActiveName(meetingNotice.getSubject());
			activities.setStartTime(meetingNotice.getMeetingDate());
			activities.setCreateDate(new Date());
			activities.setCreateUser(user.getFullname());
			activities.setTimeType(0);
			activities.setTimeNumber(1);
			AppUser appUser = appUserService.get(Long.parseLong(personId));
			activities.setAppUser(appUser);
			activities.setDataSources(1);
			activities = leaderActivitiesService.save(activities);
			leaderActivitiesService.insertArchiveActive(schemaCode, Long.parseLong(noticeId), activities.getActiveId());
		}
		return SUCCESS;
	}
}

