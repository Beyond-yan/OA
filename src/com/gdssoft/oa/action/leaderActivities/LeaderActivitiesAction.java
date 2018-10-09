package com.gdssoft.oa.action.leaderActivities;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
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
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.leaderActivities.LeaderActivities;
import com.gdssoft.oa.model.meetingNotice.MeetingNotice;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.archive.ArchivesService;
import com.gdssoft.oa.service.leaderActivities.LeaderActivitiesService;
import com.gdssoft.oa.service.meetingNotice.MeetingNoticeService;
import com.gdssoft.oa.service.system.AppUserService;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;

public class LeaderActivitiesAction extends BaseAction {

	@Resource
	private LeaderActivitiesService leaderActivitiesService;
	@Resource
	private ArchivesService archivesService;
	@Resource
	private MeetingNoticeService meetingNoticeService;
	private LeaderActivities leaderActivities;
	private Long activeId;
	private List<LeaderActivities> leaderActivitiesList;
	private Map<String, String> dateMap;
	private Map<String, List<LeaderActivities>> activitesMap;
	private String lastStartDt;
	private String nextStartDt;
	private String startTime_D_GE;
	private String schamal;
	@Resource
	private AppUserService appUserService;
	
	public String getSchamal() {
		return schamal;
	}

	public void setSchamal(String schamal) {
		this.schamal = schamal;
	}

	private String currentTime;
	private int weekType = 1;

	public String getCurrentTime() {
		return currentTime;
	}

	public void setCurrentTime(String currentTime) {
		this.currentTime = currentTime;
	}

	public String getStartTime_D_GE() {
		return startTime_D_GE;
	}

	public void setStartTime_D_GE(String startTime_D_GE) {
		this.startTime_D_GE = startTime_D_GE;
	}

	public String getLastStartDt() {
		return lastStartDt;
	}

	public void setLastStartDt(String lastStartDt) {
		this.lastStartDt = lastStartDt;
	}

	public String getNextStartDt() {
		return nextStartDt;
	}

	public void setNextStartDt(String nextStartDt) {
		this.nextStartDt = nextStartDt;
	}

	public Map<String, List<LeaderActivities>> getActivitesMap() {
		return activitesMap;
	}

	public void setActivitesMap(Map<String, List<LeaderActivities>> activitesMap) {
		this.activitesMap = activitesMap;
	}

	public int getWeekType() {
		return weekType;
	}

	public void setWeekType(int weekType) {
		this.weekType = weekType;
	}

	public Map<String, String> getDateMap() {
		return dateMap;
	}

	public void setDateMap(Map<String, String> dateMap) {
		this.dateMap = dateMap;
	}

	/**
	 * 获得列表信息
	 * 
	 * @return
	 */
	public String list() {
		QueryFilter filter = new QueryFilter(getRequest());
		filter.addSorted("appUser.userlevel", "asc");
		filter.addSorted("startTime", "desc");
		List<LeaderActivities> list = leaderActivitiesService.getAll(filter);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");
		JSONSerializer json = JsonUtil.getJSONSerializer("createDate",
				"updateDate");
		json.transform(new DateTransformer("yyyy-MM-dd HH:mm"), "startTime");
		json.transform(new DateTransformer("yyyy-MM-dd HH:mm"), "endTime");
		buff.append(json.exclude(new String[] { "class" })
				.include("appUser.fullname").serialize(list));
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
	}

	/* 显示一周的领导活动 */
	public String calendarlist() throws ParseException {
		QueryFilter filter = new QueryFilter(getRequest());
		filter.addSorted("appUser.userlevel", "ASC");
		filter.addSorted("startTime", "ASC");
		String startDate = getRequest().getParameter("startTime_D_GE");
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
		Calendar cl = Calendar.getInstance();
		cl.setTime(new Date());
		cl.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
		startTime_D_GE = formatter.format(cl.getTime());
		if (startDate == null || startDate == "") {
			startDate = formatter.format(cl.getTime());
		}
		cl.setTime(formatter.parse(startDate));
		String endDate = getRequest().getParameter("Q_startTime_D_LE");
		if (endDate == "" || endDate == null) {
			cl.add(cl.DATE, 7 * weekType);
			endDate = formatter.format(cl.getTime());
		}
		cl.setTime(formatter.parse(startDate));
		cl.add(cl.DATE, 7);
		filter.addFilter("Q_endTime_D_GE", startDate);
		filter.addFilter("Q_endTime_D_LE", null);
		filter.addFilter("Q_startTime_D_LE", endDate);
		filter.addFilter("Q_startTime_D_GE", null);
		filter.addFilter("Q_dataSources_N_EQ", "0");
		PagingBean page = filter.getPagingBean();
		page.setPageSize(1000);
		List<LeaderActivities> list = leaderActivitiesService.getAll(filter);
		// List<LeaderActivities> tempList = new ArrayList<LeaderActivities>();
		getWeekDateMap(weekType, formatter.parse(startDate));
		activitesMap = new HashMap();
		Iterator it = dateMap.keySet().iterator();
		while (it.hasNext()) {
			String mapKey = dateMap.get(it.next());
			if (!activitesMap.containsKey(mapKey)) {
				List<LeaderActivities> leaderList = new ArrayList<LeaderActivities>();
				activitesMap.put(mapKey, leaderList);
			}
		}
		for (LeaderActivities leaderActivities : list) {
			if (leaderActivities.getTimeType() == 0) {
				for (int i = 0; i < leaderActivities.getTimeNumber(); i++) {
					Calendar cc = Calendar.getInstance();
					cc.setTime(leaderActivities.getStartTime());
					cc.add(Calendar.DATE, i);
					if (cc.getTime().compareTo(formatter.parse(startDate)) < 0)
						continue;
					Calendar cend = Calendar.getInstance();
					cend.setTime(leaderActivities.getEndTime());
					int dayNumber = 0 - leaderActivities.getTimeNumber() + i
							+ 1;
					cend.add(Calendar.DATE, dayNumber);
					if (cend.getTime().compareTo(formatter.parse(endDate)) > 0)
						break;
					LeaderActivities tmepActives = new LeaderActivities();
					tmepActives.setActiveId(leaderActivities.getActiveId());
					tmepActives.setActiveName(leaderActivities.getActiveName());
					if (leaderActivities.getAppUser().getFullname().length() < 3) {
						String fullName = leaderActivities.getAppUser()
								.getFullname();
						fullName = fullName.substring(0, 1) + "　"
								+ fullName.substring(1);
						leaderActivities.getAppUser().setFullname(fullName);
					}
					tmepActives.setAppUser(leaderActivities.getAppUser());
					tmepActives.setActiveDesc(leaderActivities.getActiveDesc());
					tmepActives.setTimeNumber(leaderActivities.getTimeNumber());
					tmepActives.setTimeType(leaderActivities.getTimeType());
					tmepActives.setStartTime(cc.getTime());
					tmepActives.setEndTime(cend.getTime());
					tmepActives.setSgDate(formatter.format(tmepActives
							.getStartTime()));
					String mapKey = formatter
							.format(tmepActives.getStartTime());
					if (activitesMap.containsKey(mapKey))
						activitesMap.get(mapKey).add(tmepActives);
				}
			} else {
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
				Date smdate = sdf.parse(sdf.format(leaderActivities
						.getStartTime()));
				Date bdate = sdf
						.parse(sdf.format(leaderActivities.getEndTime()));
				Calendar cal = Calendar.getInstance();
				cal.setTime(smdate);
				/*
				 * long time1 = cal.getTimeInMillis(); cal.setTime(bdate); long
				 * time2 = cal.getTimeInMillis(); int
				 * days=(int)(time2-time1)/(1000*3600*24);
				 */
				int days = 0;
				if (smdate == null || bdate == null) {
					days = 0;
				}
				long temp = bdate.getTime() - smdate.getTime();
				if (temp > 0) {
					days = (int) (temp / (24 * 60 * 60 * 1000));
				} else if (temp < 0) {
					days = (int) (temp / (24 * 60 * 60 * 1000)) - 1;
				} else {
					days = 0;
				}
				days = days + 1;
				for (int i = 0; i < days; i++) {
					Calendar cc = Calendar.getInstance();
					cc.setTime(leaderActivities.getStartTime());
					cc.add(Calendar.DATE, i);
					if (cc.getTime().compareTo(formatter.parse(startDate)) < 0)
						continue;
					Calendar cend = Calendar.getInstance();
					cend.setTime(leaderActivities.getEndTime());
					int dayNumber = 0 - days + i + 1;
					cend.add(Calendar.DATE, dayNumber);
					if (cend.getTime().compareTo(formatter.parse(endDate)) > 0)
						break;
					LeaderActivities tmepActives = new LeaderActivities();
					tmepActives.setActiveId(leaderActivities.getActiveId());
					tmepActives.setActiveName(leaderActivities.getActiveName());
					if (leaderActivities.getAppUser().getFullname().length() < 3) {
						String fullName = leaderActivities.getAppUser()
								.getFullname();
						fullName = fullName.substring(0, 1) + "　"
								+ fullName.substring(1);
						leaderActivities.getAppUser().setFullname(fullName);
					}
					tmepActives.setAppUser(leaderActivities.getAppUser());
					tmepActives.setActiveDesc(leaderActivities.getActiveDesc());
					tmepActives.setTimeNumber(leaderActivities.getTimeNumber());
					tmepActives.setTimeType(leaderActivities.getTimeType());
					tmepActives.setStartTime(cc.getTime());
					tmepActives.setEndTime(cend.getTime());
					tmepActives.setSgDate(formatter.format(tmepActives
							.getStartTime()));
					String mapKey = formatter
							.format(tmepActives.getStartTime());
					if (activitesMap.containsKey(mapKey))
						activitesMap.get(mapKey).add(tmepActives);
				}
			}
		}
		/*
		 * Collections.sort(tempList, new Comparator() {
		 * 
		 * @Override public int compare(Object o1, Object o2) { LeaderActivities
		 * leader1 = (LeaderActivities) o1; LeaderActivities leader2 =
		 * (LeaderActivities) o2; return
		 * leader1.getStartTime().compareTo(leader2.getStartTime()); } });
		 */
		return SUCCESS;
	}

	private Date SimpleDateFormat(String startDate) {
		// TODO Auto-generated method stub
		return null;
	}

	private void getWeekDateMap(int weekType, Date dt) {
		Calendar bl = Calendar.getInstance();
		bl.setTime(dt);
		int i = bl.get(Calendar.DAY_OF_WEEK);
		bl.add(Calendar.DATE, 0 - i + 2);
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Date startDt = bl.getTime();
		Calendar b2 = Calendar.getInstance();
		b2.setTime(startDt);
		currentTime = format.format(b2.getTime());
		b2.add(Calendar.DATE, 7 * weekType);
		nextStartDt = format.format(b2.getTime());
		b2.setTime(startDt);
		b2.add(Calendar.DATE, 0 - 7 * weekType);
		lastStartDt = format.format(b2.getTime());
		dateMap = new HashMap();
		for (int m = 0; m < weekType * 7; m++) {
			b2.setTime(startDt);
			b2.add(Calendar.DATE, m);
			int weekCount = 1;
			if (m >= 7)
				weekCount = 2;
			dateMap.put(weekCount + "-" + getDayOfWeek(b2.getTime()),
					format.format(b2.getTime()));
		}
	}

	private String getDayOfWeek(Date dt) {
		Calendar bl = Calendar.getInstance();
		bl.setTime(dt);
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		int i = bl.get(Calendar.DAY_OF_WEEK);
		String str = "";
		switch (i) {
		case 2:
			str = "1";
			break;
		case 3:
			str = "2";
			break;
		case 4:
			str = "3";
			break;
		case 5:
			str = "4";
			break;
		case 6:
			str = "5";
			break;
		case 7:
			str = "6";
			break;
		default:
			str = "7";
		}
		return str;

	}

	/**
	 * 保存
	 * 
	 * @return
	 */
	public String save() {
		boolean res = true;
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		int number = 0;
		String sd = getRequest().getParameter("leaderActivities.startTime");
		String timenumber = getRequest().getParameter(
				"leaderActivities.timeNumber");
		String sdt = sd + ":00";
		String edt = sd + ":00";
		try {
			leaderActivities.setStartTime(sdf.parse(sdt));
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		number = new Integer(timenumber);
		if (0 == leaderActivities.getTimeType()) {
			edt = sd.subSequence(0, 10) + " 18:00:00 ";
			// Date start = leaderActivities.getStartTime();
			Calendar c = Calendar.getInstance();
			try {
				c.setTime(sdf.parse(edt));
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			c.add(Calendar.DATE, number - 1);
			leaderActivities.setEndTime(c.getTime());
		}
		if (1 == leaderActivities.getTimeType()) {
			Date newEnd = null;
			try {
				newEnd = sdf.parse(sdt);
			} catch (ParseException e) {
				e.printStackTrace();
			}
			Calendar nowEndTime = Calendar.getInstance();
			nowEndTime.setTime(newEnd);
			nowEndTime.add(Calendar.HOUR_OF_DAY, number);
			leaderActivities.setEndTime(nowEndTime.getTime());
		}
		if (2 == leaderActivities.getTimeType()) {
			Date newEnd = null;
			try {
				newEnd = sdf.parse(sdt);
			} catch (ParseException e) {
				e.printStackTrace();
			}
			Calendar nowEndTime = Calendar.getInstance();
			nowEndTime.setTime(newEnd);
			nowEndTime.add(Calendar.MINUTE, number * 15);
			leaderActivities.setEndTime(nowEndTime.getTime());
		}
		/*
		 * if (2 == leaderActivities.getTimeType()) { String sdt = sd + " :00";
		 * String edt = sd + " :00"; try {
		 * leaderActivities.setStartTime(sdf.parse(sdt)); } catch
		 * (ParseException e) { // TODO Auto-generated catch block
		 * e.printStackTrace(); } number = new
		 * Integer(leaderActivities.getTimeNumber().toString()); // Date start =
		 * leaderActivities.getStartTime(); Calendar c = Calendar.getInstance();
		 * try { c.setTime(sdf.parse(edt)); } catch (ParseException e) { // TODO
		 * Auto-generated catch block e.printStackTrace(); }
		 * c.add(Calendar.DATE, number - 1);
		 * leaderActivities.setEndTime(c.getTime()); } else if (0 ==
		 * leaderActivities.getTimeType()) { sd += " 08:00:00"; try {
		 * leaderActivities.setStartTime(sdf.parse(sd)); } catch (ParseException
		 * e) { // TODO Auto-generated catch block e.printStackTrace(); } try {
		 * endt = edtime.subSequence(0, 10) + " 12:00:00 ";
		 * leaderActivities.setEndTime(sdf.parse(endt)); } catch (ParseException
		 * e) { // TODO Auto-generated catch block e.printStackTrace(); } } else
		 * { sd += " 13:00:00"; try {
		 * leaderActivities.setStartTime(sdf.parse(sd)); } catch (ParseException
		 * e) { // TODO Auto-generated catch block e.printStackTrace(); } try {
		 * endt = edtime.subSequence(0, 10) + " 18:00:00 ";
		 * leaderActivities.setEndTime(sdf.parse(endt)); } catch (ParseException
		 * e) { // TODO Auto-generated catch block e.printStackTrace(); } }
		 */
		if (leaderActivities.getActiveId() == null) {
			leaderActivities.setCreateDate(new Date());
			leaderActivities.setCreateUser(ContextUtil.getCurrentUser()
					.getFullname());
			leaderActivities.getAppUser().getUserId();
			leaderActivities.setDataSources(0);
			leaderActivitiesService.save(leaderActivities);
		} else {
			LeaderActivities leader = leaderActivitiesService
					.get(leaderActivities.getActiveId());
			try {
				BeanUtil.copyNotNullProperties(leader, leaderActivities);
				leaderActivities.setUpdateDate(new Date());
				leaderActivities.setUpdateUser(ContextUtil.getCurrentUser()
						.getFullname());
				leaderActivitiesService.save(leader);
			} catch (Exception ex) {
				res = false;
				ex.printStackTrace();
			}
		}
		setJsonString("{success:" + res + "}");
		return SUCCESS;
	}

	/**
	 * 同步会议通知到领导日程
	 * 
	 * @return
	 */
	public String syncMeetingToActive () {
		boolean res = true;
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		int number = 0;
		String noticeId = getRequest().getParameter("noticeId");
		String leader = getRequest().getParameter("leader");
		String state = getRequest().getParameter("state");
		String schema = ContextUtil.getCurrentUser().getOwnerSchema();
		MeetingNotice meetingNotice = meetingNoticeService.get(Long.parseLong(noticeId));
		AppUser leaderUser = appUserService.get(Long.parseLong(leader));
		List<String> attendLeaders = new ArrayList<String>();
		List<String> attendLeadersName = new ArrayList<String>();
		if(meetingNotice.getAttendLeaders() != null){
			attendLeaders = new ArrayList<String>(Arrays.asList(meetingNotice.getAttendLeaders().split(",")));
			attendLeadersName = new ArrayList<String>(Arrays.asList(meetingNotice.getAttendLeadersName().split(",")));
		}
		LeaderActivities leaderActivities = leaderActivitiesService.findByArchivesIdAndUserId(schema, meetingNotice.getNoticeId(), Long.parseLong(leader));
		if("1".equals(state)){
			if(leaderActivities != null){
				leaderActivities.setUpdateDate(new Date());
				leaderActivities.setUpdateUser(ContextUtil.getCurrentUser()
						.getFullname());
				leaderActivities.setActiveDesc(meetingNotice.getMeetingPlace());
				leaderActivities.setActiveName(meetingNotice.getSubject());
				leaderActivities.setStartTime(meetingNotice.getMeetingDate());
			}else{
				leaderActivities = new LeaderActivities();
				leaderActivities.setActiveDesc(meetingNotice.getMeetingPlace());
				leaderActivities.setActiveName(meetingNotice.getSubject());
				leaderActivities.setStartTime(meetingNotice.getMeetingDate());
				leaderActivities.setCreateDate(new Date());
				leaderActivities.setCreateUser(ContextUtil.getCurrentUser()
						.getFullname());
				leaderActivities.setTimeType(0);
				leaderActivities.setTimeNumber(1);
				AppUser appUser = appUserService.get(Long.parseLong(leader));
				leaderActivities.setAppUser(appUser);
				leaderActivities.setDataSources(1);
			}
			leaderActivities = leaderActivitiesService.save(leaderActivities);
			leaderActivitiesService.insertArchiveActive(schema, Long.parseLong(noticeId), leaderActivities.getActiveId());
			if(attendLeaders != null && !attendLeaders.contains(leader)){
				attendLeaders.add(leader);
				meetingNotice.setAttendLeaders(StringUtils.join(attendLeaders.iterator(), ","));
				attendLeadersName.add(leaderUser.getFullname());
				meetingNotice.setAttendLeadersName(StringUtils.join(attendLeadersName.iterator(), ","));
			}
		}else{
			if(leaderActivities != null){
				leaderActivitiesService.removeArchivesActive(schema,leaderActivities.getActiveId());
				leaderActivitiesService.remove(leaderActivities);
			}
			if(attendLeaders != null && attendLeaders.contains(leader)){
				attendLeaders.remove(leader);
				meetingNotice.setAttendLeaders(StringUtils.join(attendLeaders.iterator(), ","));
				attendLeadersName.remove(leaderUser.getFullname());
				meetingNotice.setAttendLeadersName(StringUtils.join(attendLeadersName.iterator(), ","));
			}
		}
		meetingNoticeService.save(meetingNotice);
		setJsonString("{success:" + res + "}");
		return SUCCESS;
	}
	
	/**
	 * 
	 * 会议取消删除所有有关行程
	 */
	
	public String removeActiveByArchiveId(){
		boolean res = true;
		String archivesId = getRequest().getParameter("archivesId");
		String schema = ContextUtil.getCurrentUser().getOwnerSchema();
		leaderActivitiesService.removeActiveByArchiveId(schema, Long.parseLong(archivesId));
		setJsonString("{success:" + res + "}");
		return SUCCESS;
	}
	
	/**
	 * 
	 * 会议变更同步所有有关行程
	 */
	
	public String syncActiveByArchiveId(){
		boolean res = true;
		String archivesId = getRequest().getParameter("archivesId");
		Archives archives = archivesService.get(Long.parseLong(archivesId));
		String schema = ContextUtil.getCurrentUser().getOwnerSchema();
		List<LeaderActivities> leaderActivities = leaderActivitiesService.findActiveByArchiveId(schema, Long.parseLong(archivesId));
		for(LeaderActivities leaderActivitie : leaderActivities){
			leaderActivitie.setUpdateDate(new Date());
			leaderActivitie.setUpdateUser(ContextUtil.getCurrentUser()
					.getFullname());
			leaderActivitie.setActiveDesc(archives.getShortContent());
			leaderActivitie.setActiveName(archives.getSubject());
			leaderActivitie.setStartTime(archives.getLimitedDate());
			leaderActivitiesService.save(leaderActivitie);
		}
		setJsonString("{success:" + res + "}");
		return SUCCESS;
	}
	
	public String syncActiveByMeetingNoticeId(){
		boolean res = true;
		String noticeId = getRequest().getParameter("noticeId");
		MeetingNotice meetingNotice = meetingNoticeService.get(Long.parseLong(noticeId));
		String schema = ContextUtil.getCurrentUser().getOwnerSchema();
		List<LeaderActivities> leaderActivities = leaderActivitiesService.findActiveByArchiveId(schema, Long.parseLong(noticeId));
		for(LeaderActivities leaderActivitie : leaderActivities){
			leaderActivitie.setUpdateDate(new Date());
			leaderActivitie.setUpdateUser(ContextUtil.getCurrentUser()
					.getFullname());
			leaderActivitie.setActiveDesc(meetingNotice.getMeetingPlace());
			leaderActivitie.setActiveName(meetingNotice.getSubject());
			leaderActivitie.setStartTime(meetingNotice.getMeetingDate());
			leaderActivitiesService.save(leaderActivitie);
		}
		setJsonString("{success:" + res + "}");
		return SUCCESS;
	}
	
	/**
	 * 删除信息
	 * 
	 * @return
	 */
	public String multiDel() {
		String[] ids = getRequest().getParameterValues("ids");
		if (ids != null) {
			for (String id : ids) {
				leaderActivitiesService.remove(new Long(id));
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
		LeaderActivities lead = leaderActivitiesService.get(activeId);
		JSONSerializer json = JsonUtil.getJSONSerializer("createtime",
				"updatetime");
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(json.include("appUser.fullname")
				.exclude(new String[] { "class", "appUser" }).serialize(lead));
		sb.append("}");
		setJsonString(sb.toString());
		return SUCCESS;
	}

	/* 显示一月的领导活动 */
	public String getleader() {
		QueryFilter filter = new QueryFilter(getRequest());
		SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
		Date dNow = new Date();   //当前时间
		Date dBefore = new Date();
		Calendar calendar = Calendar.getInstance(); //得到日历
		calendar.setTime(dNow);//把当前时间赋给日历
		calendar.add(Calendar.MONTH, -1);  //设置为前3月
		dBefore = calendar.getTime();   //得到前3月的时间
		System.out.println(sdf1.format(dBefore));
		filter.addFilter("Q_startTime_D_GE", sdf1.format(dBefore));
		filter.addSorted("startTime", "desc");
		PagingBean page = filter.getPagingBean();
		page.setPageSize(200);
		List<LeaderActivities> list = leaderActivitiesService.getAll(filter);
//		List<LeaderActivities> list = leaderActivitiesService.getAll();
		leaderActivitiesList = new ArrayList<LeaderActivities>();
		// List<LeaderActivities> tempList = new ArrayList<LeaderActivities>();
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		for (LeaderActivities leaderActivities : list) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			Date smdate = null;
			try {
				smdate = sdf.parse(sdf.format(leaderActivities.getStartTime()));
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			Date bdate = null;
			try {
				bdate = sdf.parse(sdf.format(leaderActivities.getEndTime()));
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			int days = 0;
			if (smdate == null || bdate == null) {
				days = 0;
			}
			long temp = bdate.getTime() - smdate.getTime();
			if (temp > 0) {
				days = (int) (temp / (24 * 60 * 60 * 1000));
			} else if (temp < 0) {
				days = (int) (temp / (24 * 60 * 60 * 1000)) - 1;
			} else {
				days = 0;
			}
			days = days + 1;
			for (int i = 0; i < days; i++) {
				Calendar cc = Calendar.getInstance();
				cc.setTime(leaderActivities.getStartTime());
				cc.add(Calendar.DATE, i);
				Calendar cend = Calendar.getInstance();
				cend.setTime(leaderActivities.getEndTime());
				int dayNumber = 0 - days + i + 1;
				cend.add(Calendar.DATE, dayNumber);
				LeaderActivities tmepActives = new LeaderActivities();
				tmepActives.setActiveId(leaderActivities.getActiveId() + i
						* 100000);
				tmepActives.setActiveName(leaderActivities.getActiveName());
				if (leaderActivities.getAppUser().getFullname().length() < 3) {
					String fullName = leaderActivities.getAppUser()
							.getFullname();
					fullName = fullName.substring(0, 1) + "　"
							+ fullName.substring(1);
					leaderActivities.getAppUser().setFullname(fullName);
				}
				tmepActives.setAppUser(leaderActivities.getAppUser());
				tmepActives.setActiveDesc(leaderActivities.getActiveDesc());
				tmepActives.setTimeNumber(leaderActivities.getTimeNumber());
				tmepActives.setTimeType(leaderActivities.getTimeType());
				cc.add(Calendar.MINUTE, 1);
				tmepActives.setSgDate(formatter.format(cc.getTime()));
				tmepActives.setSdDate(formatter.format(cend.getTime()));
				tmepActives.setStartTime(cc.getTime());
				tmepActives.setEndTime(cend.getTime());
				leaderActivitiesList.add(tmepActives);
			}
		}
		/*
		 * for (LeaderActivities leaderActivities : list) { SimpleDateFormat
		 * formatter = new SimpleDateFormat( "yyyy-MM-dd HH:mm"); String sgDate
		 * = formatter.format(leaderActivities.getStartTime());
		 * leaderActivities.setSgDate(sgDate); String sdDate =
		 * formatter.format(leaderActivities.getEndTime());
		 * leaderActivities.setSdDate(sdDate); Calendar cal =
		 * Calendar.getInstance(); cal.setTime(leaderActivities.getStartTime());
		 * cal.add(Calendar.MINUTE, 4); }
		 */
		return SUCCESS;
	}

	public String showleader() {
		if (null != activeId) {
			leaderActivities = leaderActivitiesService.get(activeId);
		}
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		String sd = formatter.format(leaderActivities.getStartTime());
		leaderActivities.setSgDate(sd);
		return SUCCESS;
	}

	public LeaderActivitiesService getLeaderActivitiesService() {
		return leaderActivitiesService;
	}

	public void setLeaderActivitiesService(
			LeaderActivitiesService leaderActivitiesService) {
		this.leaderActivitiesService = leaderActivitiesService;
	}

	public LeaderActivities getLeaderActivities() {
		return leaderActivities;
	}

	public void setLeaderActivities(LeaderActivities leaderActivities) {
		this.leaderActivities = leaderActivities;
	}

	public List<LeaderActivities> getLeaderActivitiesList() {
		return leaderActivitiesList;
	}

	public void setLeaderActivitiesList(
			List<LeaderActivities> leaderActivitiesList) {
		this.leaderActivitiesList = leaderActivitiesList;
	}

	public Long getActiveId() {
		return activeId;
	}

	public void setActiveId(Long activeId) {
		this.activeId = activeId;
	}

	/* 显示一周的委领导活动 */
	public String weilist() throws ParseException {
		Long activeId = null;
		String startDate = getRequest().getParameter("startTime_D_GE");
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
		Calendar cl = Calendar.getInstance();
		cl.setTime(new Date());
		cl.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
		startTime_D_GE = formatter.format(cl.getTime());
		if (startDate == null || startDate == "") {
			startDate = formatter.format(cl.getTime());
		}
		cl.setTime(formatter.parse(startDate));
		String endDate = getRequest().getParameter("Q_startTime_D_LE");
		if (endDate == "" || endDate == null) {
			cl.add(cl.DATE, 7 * weekType);
			endDate = formatter.format(cl.getTime());
		}
		cl.setTime(formatter.parse(startDate));
		cl.add(cl.DATE, 7);
		List<LeaderActivities> list = leaderActivitiesService.Weileader(schamal,
				startDate, endDate, activeId);
		// List<LeaderActivities> tempList = new ArrayList<LeaderActivities>();
		getWeekDateMap(weekType, formatter.parse(startDate));
		activitesMap = new HashMap();
		Iterator it = dateMap.keySet().iterator();
		while (it.hasNext()) {
			String mapKey = dateMap.get(it.next());
			if (!activitesMap.containsKey(mapKey)) {
				List<LeaderActivities> leaderList = new ArrayList<LeaderActivities>();
				activitesMap.put(mapKey, leaderList);
			}
		}
		for (LeaderActivities leaderActivities : list) {
			if (leaderActivities.getTimeType() == 0) {
				for (int i = 0; i < leaderActivities.getTimeNumber(); i++) {
					Calendar cc = Calendar.getInstance();
					cc.setTime(leaderActivities.getStartTime());
					cc.add(Calendar.DATE, i);
					if (cc.getTime().compareTo(formatter.parse(startDate)) < 0)
						continue;
					Calendar cend = Calendar.getInstance();
					cend.setTime(leaderActivities.getEndTime());
					int dayNumber = 0 - leaderActivities.getTimeNumber() + i
							+ 1;
					cend.add(Calendar.DATE, dayNumber);
					if (cend.getTime().compareTo(formatter.parse(endDate)) > 0)
						break;
					LeaderActivities tmepActives = new LeaderActivities();
					tmepActives.setActiveId(leaderActivities.getActiveId());
					tmepActives.setActiveName(leaderActivities.getActiveName());
					if (leaderActivities.getAppUser().getFullname().length() < 3) {
						String fullName = leaderActivities.getAppUser()
								.getFullname();
						fullName = fullName.substring(0, 1) + "　"
								+ fullName.substring(1);
						leaderActivities.getAppUser().setFullname(fullName);
					}
					tmepActives.setAppUser(leaderActivities.getAppUser());
					tmepActives.setActiveDesc(leaderActivities.getActiveDesc());
					tmepActives.setTimeNumber(leaderActivities.getTimeNumber());
					tmepActives.setTimeType(leaderActivities.getTimeType());
					tmepActives.setStartTime(cc.getTime());
					tmepActives.setEndTime(cend.getTime());
					tmepActives.setSgDate(formatter.format(tmepActives.getStartTime()));
					String mapKey = formatter.format(tmepActives.getStartTime());
					if (activitesMap.containsKey(mapKey))
						activitesMap.get(mapKey).add(tmepActives);
				}
			} else {
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
				Date smdate = sdf.parse(sdf.format(leaderActivities
						.getStartTime()));
				Date bdate = sdf
						.parse(sdf.format(leaderActivities.getEndTime()));
				Calendar cal = Calendar.getInstance();
				cal.setTime(smdate);
				/*
				 * long time1 = cal.getTimeInMillis(); cal.setTime(bdate); long
				 * time2 = cal.getTimeInMillis(); int
				 * days=(int)(time2-time1)/(1000*3600*24);
				 */
				int days = 0;
				if (smdate == null || bdate == null) {
					days = 0;
				}
				long temp = bdate.getTime() - smdate.getTime();
				if (temp > 0) {
					days = (int) (temp / (24 * 60 * 60 * 1000));
				} else if (temp < 0) {
					days = (int) (temp / (24 * 60 * 60 * 1000)) - 1;
				} else {
					days = 0;
				}
				days = days + 1;
				for (int i = 0; i < days; i++) {
					Calendar cc = Calendar.getInstance();
					cc.setTime(leaderActivities.getStartTime());
					cc.add(Calendar.DATE, i);
					if (cc.getTime().compareTo(formatter.parse(startDate)) < 0)
						continue;
					Calendar cend = Calendar.getInstance();
					cend.setTime(leaderActivities.getEndTime());
					int dayNumber = 0 - days + i + 1;
					cend.add(Calendar.DATE, dayNumber);
					if (cend.getTime().compareTo(formatter.parse(endDate)) > 0)
						break;
					LeaderActivities tmepActives = new LeaderActivities();
					tmepActives.setActiveId(leaderActivities.getActiveId());
					tmepActives.setActiveName(leaderActivities.getActiveName());
					if (leaderActivities.getAppUser().getFullname().length() < 3) {
						String fullName = leaderActivities.getAppUser()
								.getFullname();
						fullName = fullName.substring(0, 1) + "　"
								+ fullName.substring(1);
						leaderActivities.getAppUser().setFullname(fullName);
					}
					tmepActives.setAppUser(leaderActivities.getAppUser());
					tmepActives.setActiveDesc(leaderActivities.getActiveDesc());
					tmepActives.setTimeNumber(leaderActivities.getTimeNumber());
					tmepActives.setTimeType(leaderActivities.getTimeType());
					tmepActives.setStartTime(cc.getTime());
					tmepActives.setEndTime(cend.getTime());
					tmepActives.setSgDate(formatter.format(tmepActives
							.getStartTime()));
					String mapKey = formatter
							.format(tmepActives.getStartTime());
					if (activitesMap.containsKey(mapKey))
						activitesMap.get(mapKey).add(tmepActives);
				}
			}
		}
		/*
		 * Collections.sort(tempList, new Comparator() {
		 * 
		 * @Override public int compare(Object o1, Object o2) { LeaderActivities
		 * leader1 = (LeaderActivities) o1; LeaderActivities leader2 =
		 * (LeaderActivities) o2; return
		 * leader1.getStartTime().compareTo(leader2.getStartTime()); } });
		 */
		return SUCCESS;
	}

	/* 显示一月的委领导活动 */
	public String getweileader() {
		String startDate = "";
		String endDate = "";
		Long activeId = null;
		List<LeaderActivities> list = leaderActivitiesService.Weileader(schamal,
				startDate, endDate, activeId);
		leaderActivitiesList = new ArrayList<LeaderActivities>();
		// List<LeaderActivities> tempList = new ArrayList<LeaderActivities>();
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		for (LeaderActivities leaderActivities : list) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			Date smdate = null;
			try {
				smdate = sdf.parse(sdf.format(leaderActivities.getStartTime()));
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			Date bdate = null;
			try {
				bdate = sdf.parse(sdf.format(leaderActivities.getEndTime()));
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			int days = 0;
			if (smdate == null || bdate == null) {
				days = 0;
			}
			long temp = bdate.getTime() - smdate.getTime();
			if (temp > 0) {
				days = (int) (temp / (24 * 60 * 60 * 1000));
			} else if (temp < 0) {
				days = (int) (temp / (24 * 60 * 60 * 1000)) - 1;
			} else {
				days = 0;
			}
			days = days + 1;
			for (int i = 0; i < days; i++) {
				Calendar cc = Calendar.getInstance();
				cc.setTime(leaderActivities.getStartTime());
				cc.add(Calendar.DATE, i);
				Calendar cend = Calendar.getInstance();
				cend.setTime(leaderActivities.getEndTime());
				int dayNumber = 0 - days + i + 1;
				cend.add(Calendar.DATE, dayNumber);
				LeaderActivities tmepActives = new LeaderActivities();
				tmepActives.setActiveId(leaderActivities.getActiveId() + i
						* 100000);
				tmepActives.setActiveName(leaderActivities.getActiveName());
				if (leaderActivities.getAppUser().getFullname().length() < 3) {
					String fullName = leaderActivities.getAppUser()
							.getFullname();
					fullName = fullName.substring(0, 1) + "　"
							+ fullName.substring(1);
					leaderActivities.getAppUser().setFullname(fullName);
				}
				tmepActives.setAppUser(leaderActivities.getAppUser());
				tmepActives.setActiveDesc(leaderActivities.getActiveDesc());
				tmepActives.setTimeNumber(leaderActivities.getTimeNumber());
				tmepActives.setTimeType(leaderActivities.getTimeType());
				cc.add(Calendar.MINUTE, 1);
				tmepActives.setSgDate(formatter.format(cc.getTime()));
				tmepActives.setSdDate(formatter.format(cend.getTime()));
				tmepActives.setStartTime(cc.getTime());
				tmepActives.setEndTime(cend.getTime());
				leaderActivitiesList.add(tmepActives);
			}
		}
		/*
		 * for (LeaderActivities leaderActivities : list) { SimpleDateFormat
		 * formatter = new SimpleDateFormat( "yyyy-MM-dd HH:mm"); String sgDate
		 * = formatter.format(leaderActivities.getStartTime());
		 * leaderActivities.setSgDate(sgDate); String sdDate =
		 * formatter.format(leaderActivities.getEndTime());
		 * leaderActivities.setSdDate(sdDate); Calendar cal =
		 * Calendar.getInstance(); cal.setTime(leaderActivities.getStartTime());
		 * cal.add(Calendar.MINUTE, 4); }
		 */
		return SUCCESS;
	}

	/**
	 * 显示委领导详细信息
	 * 
	 * @return
	 */
	public String getwei() {
		String startDate = "";
		String endDate = "";
		Long activeId = null;
		String active = getRequest().getParameter("activeId");
		if (StringUtils.isNotBlank(active)) {
			activeId = new Long(active);
		}
		List<LeaderActivities> list = leaderActivitiesService.Weileader(schamal,
				startDate, endDate, activeId);
		LeaderActivities lead =list.get(0);
		JSONSerializer json = JsonUtil.getJSONSerializer("createtime",
				"updatetime");
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(json.include("appUser.fullname")
				.exclude(new String[] { "class", "appUser" }).serialize(lead));
		sb.append("}");
		setJsonString(sb.toString());
		return SUCCESS;
	}
}
