package com.gdssoft.oa.action.admin;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Type;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.time.DateUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.JsonUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.model.admin.BoardType;
import com.gdssoft.oa.model.admin.Boardroo;
import com.gdssoft.oa.model.admin.ConfAttend;
import com.gdssoft.oa.model.admin.Conference;
import com.gdssoft.oa.model.communicate.SmsMobile;
import com.gdssoft.oa.model.leaderActivities.LeaderActivities;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.SysConfig;
import com.gdssoft.oa.service.admin.BoardTypeService;
import com.gdssoft.oa.service.admin.BoardrooService;
import com.gdssoft.oa.service.admin.ConfAttendService;
import com.gdssoft.oa.service.admin.ConferenceService;
import com.gdssoft.oa.service.communicate.SmsMobileService;
import com.gdssoft.oa.service.leaderActivities.LeaderActivitiesService;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.oa.service.system.SysConfigService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import flexjson.DateTransformer;
import flexjson.JSONSerializer;

/**
 * @description ConferenceAction
 * @author YHZ
 * @date 2010-10-8 PM
 * 
 */
public class ConferenceAction extends BaseAction {
	private static int addHours = 12;//定义上午、下午分界的小时数
	private static int addMinutes = 0;//定义小时分界的分钟数
	private SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	private SimpleDateFormat sdf_time = new SimpleDateFormat("HH:mm:ss");	
	private SimpleDateFormat sdf_date = new SimpleDateFormat("yyyy-MM-dd");	
	@Resource
	private ConferenceService conferenceService;
	@Resource
	private BoardrooService boardRooService;
	@Resource
	private BoardTypeService boardTypeService;
	@Resource
	private SysConfigService sysConfigService;
	@Resource
	private SmsMobileService  smsMobileService;

	private ConfAttendService confAttendService;
	private AppUserService appUserService;
	private ConfAttend confAttend; // cxt
	private AppUser appuser1;
	private Long confId;
	private String filePath;
	private String checkReason;
	// ###权限Id####//
	private String viewer; // 查看人
	private String updater; // 修改人
	private String summary;// 创建纪要人
	private Conference conference;
	private LeaderActivities leaderActivities;
	private Date startTime;
	private Date endTime;
	private Date endDate;
	private Date startDate;
	private int times;// 频率
	private int bookType;// 类别
	private int countNum;// 长期会议室的周次、日数
	private Date tempStartDate;
	private Date tempEndDate;
	private Date tempStartTime;
	private Date tempEndTime;
	private int isLong; // 是否是长期会议室
	private int weekDay; // 预定的星期数

	private Date realStartTime;// 页面传过来的真值
	private Date realEndTime;
	protected transient final Log log = LogFactory.getLog(getClass());
	public Date getRealStartTime() {
		return realStartTime;
	}

	public void setRealStartTime(Date realStartTime) {
		this.realStartTime = realStartTime;
	}

	public Date getRealEndTime() {
		return realEndTime;
	}

	public void setRealEndTime(Date realEndTime) {
		this.realEndTime = realEndTime;
	}

	public int getIsLong() {
		return isLong;
	}

	public void setIsLong(int isLong) {
		this.isLong = isLong;
	}

	public int getWeekDay() {
		return weekDay;
	}

	public void setWeekDay(int weekDay) {
		this.weekDay = weekDay;
	}

	public String getViewer() {
		return viewer;
	}

	public void setViewer(String viewer) {
		this.viewer = viewer;
	}

	public String getUpdater() {
		return updater;
	}

	public void setUpdater(String updater) {
		this.updater = updater;
	}

	public String getSummary() {
		return summary;
	}

	public void setSummary(String summary) {
		this.summary = summary;
	}

	public String getFilePath() {
		return this.filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	public Long getConfId() {
		return confId;
	}

	public void setConfId(Long confId) {
		this.confId = confId;
	}

	public Conference getConference() {
		return conference;
	}

	public void setConference(Conference conference) {
		this.conference = conference;
	}

	public String getCheckReason() {
		return checkReason;
	}

	public void setCheckReason(String checkReason) {
		this.checkReason = checkReason;
	}

	public ConfAttendService getConfAttendService() {
		return confAttendService;
	}

	public void setConfAttendService(ConfAttendService confAttendService) {
		this.confAttendService = confAttendService;
	}

	public AppUserService getAppUserService() {
		return appUserService;
	}

	public void setAppUserService(AppUserService appUserService) {
		this.appUserService = appUserService;
	}

	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	public int getTimes() {
		return times;
	}

	public void setTimes(int times) {
		this.times = times;
	}

	public int getBookType() {
		return bookType;
	}

	public void setBookType(int bookType) {
		this.bookType = bookType;
	}

	public int getCountNum() {
		return countNum;
	}

	public void setCountNum(int countNum) {
		this.countNum = countNum;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getTempStartDate() {
		return tempStartDate;
	}

	public void setTempStartDate(Date tempStartDate) {
		this.tempStartDate = tempStartDate;
	}

	public Date getTempEndDate() {
		return tempEndDate;
	}

	public void setTempEndDate(Date tempEndDate) {
		this.tempEndDate = tempEndDate;
	}

	public Date getTempStartTime() {
		return tempStartTime;
	}

	public void setTempStartTime(Date tempStartTime) {
		this.tempStartTime = tempStartTime;
	}

	public Date getTempEndTime() {
		return tempEndTime;
	}

	public void setTempEndTime(Date tempEndTime) {
		this.tempEndTime = tempEndTime;
	}

	// 我的将要参加的会议
	public String displayMyconf() {
		QueryFilter filter = new QueryFilter(getRequest());
		/*filter.addFilter("Q_status_SN_EQ", "1");
		filter.addFilter("Q_startTime_D_GE", sdf.format(new java.util.Date())); // 将要参加
*/		filter.addSorted("startTime", "DESC");
		filter.addFilter("Q_applyStatus_SN_LE", "2");// 待我参加， 取得审核通过后的会议记录
		filter.addFilter("Q_applyStatus_SN_NEQ", "-1");// 待我参加， 取得审核通过后的会议记录
		filter.addFilter("Q_applyStatus_SN_NEQ", "1");// 待我参加， 取得审核通过后的会议记录
		filter.addFilter("Q_isLong_SN_NEQ", "2");		
		List<Conference> list = conferenceService.getAll(filter);
		for (int i = 0; i < list.size(); i++) {
			Conference cf = list.get(i);
			if (containtMy(cf.getCompere()) && containtMy(cf.getRecorder())
					&& containtMy(cf.getAttendUsers())) {
				list.remove(i);
			}
			if (i > 7) { // 只显示8条数据
				for (int j = 7; j < list.size(); j++)
					list.remove(j);
			}
		}
		getRequest().setAttribute("myConferenceList", list);
		return "display";
	}

	/**
	 * @description 暂存会议信息
	 */
	public String zanCun() {
		QueryFilter filter = new QueryFilter(getRequest());
		// 暂存会议applyStatus=1 搜索待申請會議記錄
		// filter.addFilter("Q_status_SN_EQ", "0");
		// filter.addFilter("Q_applyStatus_SN_EQ", "1");
		// applyStatus不等于4是：会议记录不是被取消的状态
		//（Q_isLong_SN_NEQ", "1"）表示不显示长期会议室的子笔记录
		filter.addFilter("Q_applyStatus_SN_LE", "4");
		filter.addFilter("Q_isLong_SN_NEQ", "1");
		return filter(filter);
	}

	/**
	 * @description 待我参加
	 */
	public String myJoin() {
		return myJoinInfo(true);
	}

	/**
	 * @description 我已参加
	 */
	public String myJoined() {
		return myJoinInfo(false);
	}

	/**
	 * @description 待开会议{status=1发送,startTime未到}
	 */
	public String daiKai() {
		QueryFilter filter = new QueryFilter(getRequest());
		filter.addFilter("Q_startTime_D_GE", sdf.format(new Date()));
		filter.addFilter("Q_status_SN_EQ", "1");
		return filter(filter);
	}

	/**
	 * @description 已开会议{status=1发送,endTime已过}
	 */
	public String yiKai() {
		QueryFilter filter = new QueryFilter(getRequest());
		filter.addFilter("Q_endTime_D_LE", sdf.format(new Date()));
		filter.addFilter("Q_status_SN_EQ", "1");
		return filter(filter);
	}

	/**
	 * @description 获取创建会议纪要标题信息
	 */
	public String getConfTopic() {
		PagingBean pb = getInitPagingBean();
		String confTopic = getRequest().getParameter("Q_confTopic_S_LK");
		List<Conference> list = conferenceService.getConfTopic(confTopic, pb);
		// 该筛选条件会出现重复数据
		// filter.addFilter("Q_confPrivilege.rights_SN_EQ", "3");
		return toJson(pb, list);
	}

	/**
	 * @description 发送会议通知审批
	 */
	public String send() {
		String msg = judgeBoardRoomNotUse();
		if (msg.equalsIgnoreCase("success")) {
			if (conference.getIsEmail() == null)
				conference.setIsEmail(Conference.ISNOEMAIL);
			if (conference.getIsMobile() == null)
				conference.setIsMobile(Conference.ISNOMOBILE);
			conference.setStatus(Conference.Apply);
			conferenceService.send(conference, viewer, updater, summary,
					filePath);
			setJsonString("{success:true}");
		} else {
			setJsonString("{failure:true,msg:'" + msg + "'}");
		}
		return SUCCESS;
	}

	
	/**
	 * 显示列表,使用权调整使用，用于查询长期预定的主表以及非长期预定已审核通过以及退回的表
	 * 
	 */
	public String list() {
		QueryFilter filter = new QueryFilter(getRequest());
		// 添加此筛选，一条数据显示多条重复数据
		// filter.addFilter("Q_confPrivilege.rights_SN_EQ", "1");
		// 獲取狀態是已審核并不取消的
		filter.addFilter("Q_applyStatus_SN_GT", "1");
		filter.addFilter("Q_applyStatus_SN_LT", "4");
		filter.addFilter("Q_isLong_SN_NEQ", "1");		
		return filter(filter);
	}
	/**
	 * 批量删除,删除之前
	 */
	public String multiDel() {
		String[] ids = getRequest().getParameterValues("ids");
		if (ids != null) {
			for (String id : ids) {
				confAttendService.delete(new Long(id));
				conferenceService.remove(new Long(id));
				conferenceService.delSubConf(new Long(id));
			}
		}
		jsonString = "{success:true}";
		return SUCCESS;
	}
	/**
	 * @description 显示详细信息
	 * 
	 */
	public String get() {
		Conference conference = conferenceService.get(confId);
		
			
		if (!(confId == null && " ".equals(confId))) {
			appuser1 = new AppUser();
			appuser1 = appUserService.get(conference.getApplicantId());
		}
		// 将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		if (!(appuser1 == null && " ".equals(appuser1))) {
			conference.setDepId(appuser1.getDepartment().getDepId());
			conference.setDepName(appuser1.getDepartment().getDepName());
			conference.setPhone(appuser1.getPhone());
		}
		
		/*Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss")
				.create();
		
		sb.append(gson.toJson(conference));
			*/
		JSONSerializer json = new JSONSerializer();
		json.transform(new DateTransformer("yyyy-MM-dd HH:mm"), "startTime","endTime","sendtime","createtime","createDate","updateDate");
		
		//sb.append(json.include("contUser.fullname","contUser.userId").exclude(new String[] { "class","contUser" }).serialize(conference));
		sb.append(json.serialize(conference));
		setJsonString(sb.append("}").toString());
		return SUCCESS;
	}

	/**
	 * @author xintong
	 * @category 对于会议申请(包括长短期会议)做审核操作:同意并保存
	 */
	public String save() {
		String startTime = getRequest().getParameter("conference.startTime");
		String endTime = getRequest().getParameter("conference.endTime");
		Calendar startCalendar = this.calendar(startTime);
		Calendar endCalendar = this.calendar(endTime);
		conference.setStartTime(startCalendar.getTime());
		conference.setEndTime(endCalendar.getTime());
		try {			
			Conference conf11=new  Conference();
			String str="";
//			SimpleDateFormat sdf1=new SimpleDateFormat("yyyy-MM-dd");
			Date startType = this.formatDate(startCalendar.getTime()).getTime();
			Date endType = this.formatDate(endCalendar.getTime()).getTime();
			Long number = null;
			if(!startType.equals(endType)){
				startCalendar.setTime(startType);
				endCalendar.setTime(endType);
				number = (endCalendar.getTimeInMillis()-startCalendar.getTimeInMillis())/(1000*3600*24)+1;
				conference.setTimeType(2);
				conference.setTimeNumber(number);
			}else{
				startCalendar = this.subDate(startCalendar);
				endCalendar = this.subDate(endCalendar);
				if(startCalendar.get(Calendar.AM_PM) == endCalendar.get(Calendar.AM_PM)){
					conference.setTimeType(startCalendar.get(Calendar.AM_PM));
				}else{
					conference.setTimeType(2);
					conference.setTimeNumber(new Long(1));
				}
				startCalendar = this.addDate(startCalendar);
				endCalendar = this.addDate(endCalendar);
			}
			String msg = judgeBoardRoomNotUse();
			
			if(msg.equalsIgnoreCase("success")){
				if (conference.getConfId() == null) {
					//如果是新的会议，则进行保存操作，不存在为null情况
					conferenceService.save(conference);
				} else {
					
					Conference orgConference = conferenceService.get(conference
							.getConfId());//获取该会议的所有信息
					int ifIsLong = orgConference.getIsLong();	//获取会议室isLong栏位，判别短期还是长期会议的预定			
					appuser1 = new AppUser();
					appuser1 = ContextUtil.getCurrentUser();
					orgConference.setCheckName(appuser1.getFullname());//设置审核人名字
					orgConference.setCheckUserId(appuser1.getUserId());//设置审核人id
//					orgConference.setRoomContactUser(conference.getRoomContactUser());
					orgConference.setAttendConfine(conference.getAttendConfine());
					orgConference.setRoomContactTel(conference.getRoomContactTel());
					orgConference.setCheckReason(conference.getCheckReason());
					orgConference.setApplyStatus(conference.getApplyStatus());
					orgConference.setConfTopic(conference.getConfTopic());
					orgConference.setRoomId(conference.getRoomId());
					orgConference.setRoomName(conference.getRoomName());
					orgConference.setStartTime(conference.getStartTime());
					orgConference.setEndTime(conference.getEndTime());
					orgConference.setContactTel(conference.getContactTel());
					orgConference.setConfContent(conference.getConfContent());
					orgConference.setTimeType(conference.getTimeType());
					orgConference.setTimeNumber(conference.getTimeNumber());
	//				conference.setApplyStatus((short) 2);//将审批状态改为已审核
//					BeanUtil.copyNotNullProperties(orgConference, conference);//拷贝conference的信息到orgConference中
					conf11=conferenceService.save(orgConference); // 非长期会议室以及长期会议的父表的审批，并返回审批后的会议信息
					if(2 == orgConference.getApplyStatus()){//为通过审核的会议联系人发送短信
	System.out.println(orgConference.getContUser().getUserId());
						SimpleDateFormat sdf = new SimpleDateFormat("yyyy年MM月dd日 hh时mm分");
						String contactId = String.valueOf(orgConference.getContUser().getUserId());
						String content = "您申请的会议已通过审核，会议开始时间为"+sdf.format(orgConference.getStartTime())+"，会议室为"+orgConference.getRoomName()
								+"请您按时开会！";
	System.out.println(content);
						smsMobileService.saveSms(contactId, content);
					}
					setJsonString("{success:true}");
					if (ifIsLong == 2) {// 长期会议室子笔审批
						longConfCheck(2, 0);	//审核通过的子会议					
						if(conf11.getBookType()==8){	//按天申请的长期会议，进行邮件提示					
							String start_time=sdf_time.format(conf11.getStartTime());
							String end_time=sdf_time.format(conf11.getEndTime());					
							String start_date=sdf_date.format(conf11.getStartTime());
							String end_date=sdf_date.format(conf11.getEndTime());						
							str="长期会议提示：您在 "+start_date+" ~ "+end_date+" 期间，每天  "+start_time+" ~ "+end_time+" 于  "+conf11.getRoomName()+"会议室 有待开会议!";
						}
						else{	//按星期申请的长期会议，进行邮件提示					
							String start_time=sdf_time.format(conf11.getStartTime());
							String end_time=sdf_time.format(conf11.getEndTime());					
							String start_date=sdf_date.format(conf11.getStartTime());
							String end_date=sdf_date.format(conf11.getEndTime());
							int dateDay=conf11.getBookType();
							String stringDate=getXingQi(dateDay);//将数字转换成大写的星期数
							str="长期会议提示：您在 "+start_date+" ~ "+end_date+" 期间，每周星期"+stringDate+start_time+" ~ "+end_time+" 于  "+conf11.getRoomName()+"会议室 有待开会议!";
						}
					} else {//短期会议邮件提示					
						String start_time=sdf.format(conf11.getStartTime());
						String end_time=sdf.format(conf11.getEndTime());					
						str="会议提示：您在 "+start_time+" ~ "+end_time+" 期间，"+" 于  "+conf11.getRoomName()+"会议室 有待开会议!";
					}	
					log.debug(str);				
				}
			}else {
				setJsonString("{failure:true,msg:'" + msg + "'}");
			}

		} catch (Exception ex) {
			ex.printStackTrace();
			log.error(ex.getMessage());
			setJsonString("{failure:true,msg:'对不起，会议审核失败！'}");
		}
		return SUCCESS;
	}

	/**
	 * @author f3225932
	 * @category 更新会议状态：用于退回以及取消会议
	 * @param status  数据库中状态：0：未删除(发布)、1：已删除、2：草稿(至少要有会议议题)、3：已创建会议纪要。
	 * @param applyStatus 申请状态：  3不同意；4取消，	
	 * @return
	 */	
	public  String updateConferenceInfo(int applyStatus,int status){
		if (conference.getConfId() == null) {
			conferenceService.save(conference);
		} else {
			Conference orgConference = conferenceService.get(conference
					.getConfId());
			try {
				appuser1 = new AppUser();
				appuser1 = ContextUtil.getCurrentUser();
				/*if(null == conference.getRoomContactUser().getUserId()){
					conference.setRoomContactUser(null);
				}*/
				// 软删除:将发文状态改为1表示删除，申请状态改为4表示取消
				conference.setStatus((short) status);
				conference.setApplyStatus((short) applyStatus);
				conference.setCheckName(appuser1.getFullname());
				conference.setCheckUserId(appuser1.getUserId());
				conference.setUpdateBy(appuser1.getFullname());
				conference.setUpdateDate(new Date());
				BeanUtil.copyNotNullProperties(orgConference, conference);
				conferenceService.save(orgConference);
				int ifIsLong = orgConference.getIsLong();
				setJsonString("{success:true}");
				if (ifIsLong == 2) {
					// 长期会议室审批
					longConfCheck(applyStatus, status);
				} 
			} catch (Exception ex) {
				log.error(ex.getMessage());
			}
		}
		return SUCCESS;		
	}	
	
	/**
	 * @author f3225932
	 * @category 不通过的会议的申请
	 * @return
	 */
	public String disagree() {
		return updateConferenceInfo(3,0);	//状态3：会议不通过；0：不删除	
	}	
	/**
	 * @author f3225932
	 * @category 取消会议的申请，软删除
	 * @return
	 */	
	public String display() {		
		return updateConferenceInfo(4,1);	//4：取消会议申请；1：审批软删除
	}

	/**
	 * @description 加载会议室信息[编号Id,标题title]
	 */
	public String getBoardroo() {
		List<Boardroo> list = boardRooService.getAll();
		StringBuffer bf = new StringBuffer("[['','全部'],");
		for (Boardroo br : list) {
			bf.append("['").append(br.getRoomId()).append("','").append(
					br.getRoomname()).append("'],");
		}
		bf.deleteCharAt(bf.length() - 1).append("]");
		setJsonString(bf.toString());
		return SUCCESS;
	}

	/**
	 * @description 获取所有的会议类型
	 */
	public String getTypeAll() {
		List<BoardType> list = boardTypeService.getAll();
		StringBuffer bf = new StringBuffer("[");
		for (BoardType bt : list) {
			bf.append("['").append(bt.getTypeId()).append("','").append(
					bt.getTypeName()).append("'],");
		}
		bf.deleteCharAt(bf.length() - 1).append("]");
		setJsonString(bf.toString());
		return SUCCESS;
	}

	/**
	 * @description 会议审批，只是修改会议状态
	 */
	public String apply() {
		String status = getRequest().getParameter("applyStatus");
		boolean bo = status != null && status.equals("1") ? true : false;
		String msg = conferenceService.apply(confId, checkReason, bo);

		if (msg.equals("success"))
			setJsonString("{success:true}");
		else
			setJsonString("{failure:true,msg:'对不起，会议审核失败！'}");
		return SUCCESS;
	}

	/**
	 * @description 查询待我审核的会议信息
	 */
	public String daiConfApply() {
		QueryFilter filter = new QueryFilter(getRequest());
		filter.addFilter("Q_checkUserId_L_EQ", ContextUtil.getCurrentUserId()
				.toString());
		filter.addFilter("Q_status_SN_EQ", "2");
		filter.addSorted("createtime", "DESC");
		return filter(filter);
	}

	/**
	 * 查询没有通过的会议审核记录信息
	 */
	public String unThrought() {
		QueryFilter filter = new QueryFilter(getRequest());
		filter.addFilter("Q_status_SN_EQ", "3");
		filter.addSorted("createtime", "DESC");
		return filter(filter);
	}

	/**
	 * 待我审核的会议提示信息
	 */
	public String displyApply() {
		QueryFilter filter = new QueryFilter(getRequest());
		filter.addFilter("Q_checkUserId_L_EQ", ContextUtil.getCurrentUserId()
				.toString());
		filter.addFilter("Q_status_SN_EQ", "2");
		filter.addFilter("Q_startTime_D_GE", sdf.format(new Date()));
		filter.addSorted("createtime", "DESC");
		List<Conference> list = conferenceService.getAll(filter);
		if (list.size() > 8) {
			for (int i = 7; i < list.size(); i++) {
				list.remove(i);
			}
		}
		getRequest().setAttribute("applyConferenceList", list);
		return "displayApply";
	}	

	/**
	 * @description 将List转化为Gson格式的数据
	 */
	private String toJson(PagingBean pb, List<Conference> list) {
		Type type = new TypeToken<List<Conference>>() {
		}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(pb.getTotalItems()).append(",result:");
		Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd hh:mm:ss")
				.create();
		buff.append(gson.toJson(list, type));
		buff.append("}");
		setJsonString(buff.toString());
		return SUCCESS;
	}
	/**
	 * @description 根据QueryFilter筛选查询对应的数据，返回Gson格式的数据
	 */
	private String filter(QueryFilter filter) {
		filter.addSorted("startTime", "DESC");// 开始时间倒序
		List<Conference> list = conferenceService.getAll(filter);
		// 筛选可以查看的数据显示
		Type type = new TypeToken<List<Conference>>() {
		}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems()).append(
						",result:");
		Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm")
				.create();
		buff.append(gson.toJson(list, type));
		buff.append("}");
		setJsonString(buff.toString());
		return SUCCESS;
	}

	/**
	 * @description 我的会议,参数：true待我参加的会议,false我已参加的会议
	 */
	private String myJoinInfo(boolean bo) {
		QueryFilter filter = new QueryFilter(getRequest());
		Long userId = ContextUtil.getCurrentUserId();
		String userIds = userId.toString();
		if (bo) {
			filter.addFilter("Q_applyStatus_SN_LE", "2");// 待我参加， 取得审核通过后的会议记录
			filter.addFilter("Q_applyStatus_SN_GE", "-1");// 待我参加， 取得审核通过后的会议记录
			filter.addFilter("Q_applyStatus_SN_NEQ", "1");// 待我参加， 取得审核通过后的会议记录
			filter.addFilter("Q_isLong_SN_NEQ", "2");
			// 与我相关并是长期记录的子记录的记录或者是非长期记录
			/* filter.addFilter("Q_startTime_D_GE", sdf .format(new
			 * java.util.Date())); //
			 */} else {
			filter.addFilter("Q_applyStatus_SN_LT", "4");// 由我发起并不被删除的会议记录
			// filter.addFilter("Q_applyStatus_SN_GT", "1");//由我发起并不被删除的会议记录
			//filter.addFilter("Q_applicantId_L_EQ", userIds);// 由我发起并不被删除的会议记录
			if("1" != userIds && !"1".equals(userIds)){
				filter.addFilter("Q_appUser.userId_L_EQ", userIds);// 由我发起并不被删除的会议记录20110706
			}
			filter.addFilter("Q_isLong_SN_NEQ", "1");// 查询非子记录的长期或非长期会议记录		
		}
		// filter.addSorted("startTime", "DESC");
		List<Conference> list = conferenceService.getAll(filter);		
		int pageCt = 0;
		if (bo) {
			for (int i = 0; i < list.size(); i++) {
				Conference cf = list.get(i);
				List<ConfAttend> listconfAt = confAttendService.getConfAt(cf
						.getConfId());
				boolean mm = true;
				for (ConfAttend conf : listconfAt) {
					if (userId.equals(conf.getUserId())) { // 取得conf_attend人员的userId,只要有一笔符合的记录返回false
						mm = false;
						break;
					}
				}
				if (mm) {
					list.remove(i);
					pageCt++;
				}
			}
		}
		Type type = new TypeToken<List<Conference>>() {
		}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(filter.getPagingBean().getTotalItems() - pageCt)
				.append(",result:");
		
//		Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss")
//				.create();
//		buff.append(gson.toJson(list, type));
		JSONSerializer json = JsonUtil.getJSONSerializer("createDate","updateDate");
		json.transform(new DateTransformer("yyyy-MM-dd HH:mm"), "startTime");
		json.transform(new DateTransformer("yyyy-MM-dd HH:mm"), "endTime");
		buff.append(json.exclude(new String[] { "class","appUser.password"}).serialize(list));
		buff.append("}");
		setJsonString(buff.toString());
		return SUCCESS;
		
	}
	/**
	 * @description 判断是否包含当前用户,true不是的
	 */
	private boolean containtMy(String str) {
		boolean bo = true; // 默认不是的
		Long userId = ContextUtil.getCurrentUserId();
		int index = str.indexOf(userId.toString());
		if (index > 1 && str.substring(index - 1, index).equals(","))
			bo = false;
		else if (index == 0)
			bo = false;
		return bo;
	}

	/**
	 * 判断会议室是否可用
	 */
	private String judgeBoardRoomNotUse() {
		log.debug("判断会议室是否可用");
		Date startTime = this.compareTime(conference.getStartTime(), true);
		Date endTime = this.compareTime(conference.getEndTime(), false);
		/*SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date startTime = null;
		try {
			startTime = sdf.parse(sdf.format(cal.getTime()));
		} catch (ParseException e) {
			e.printStackTrace();
		}*/
System.out.println("startTime="+startTime);
System.out.println("endTime="+endTime);
		/*boolean result =  conferenceService.getBoardRoomNotUse(conference.getConfId(),
				startTime, conference.getEndTime(), conference.getTimeType(), conference
						.getRoomId());*/
		String result = conferenceService.judgeBoardRoomNotUse(conference.getConfId(), startTime, 
				endTime, conference.getRoomId(), conference.getStartTime(), conference.getEndTime());
		/*if(result){
			return conference.getRoomName()+"会议室在此时间段内不能使用，请选择其他时间段！";
		}
		else
			return "success";*/
		return result;
		
	}

	// 会议室已审核记录软删除
	public String softDel() {
		String[] ids = getRequest().getParameterValues("ids");
		if (ids != null) {

			for (String id : ids) {
				try {
					conference = new Conference();
					Conference orgConference = conferenceService.get(new Long(
							id));
					appuser1 = new AppUser();
					appuser1 = ContextUtil.getCurrentUser();
					conference.setApplyStatus((short) 4);
					conference.setUpdateBy(appuser1.getFullname());
					conference.setUpdateDate(new Date());
					conference.setCheckReason("被取消");
					BeanUtil.copyNotNullProperties(orgConference, conference);
					conferenceService.save(orgConference);
				} catch (Exception e) {
					log.error(e.getMessage());
				}
			}
		}
		jsonString = "{success:true}";
		return SUCCESS;

	}

	/**
	 * @author f3225932
	 * @category 根据时间带出会议室信息[编号Id,标题title],用于会议室调整时页面会议室带出
	 * @return
	 */
	public String searchBoardroo() {
		log.info("查找会议室");
		try {
			List<Boardroo> list = null;
			List<Boardroo> BoardRoom = null;
			List<Conference> listForDate=new ArrayList<Conference>();
			String endDate22 = getRequest().getParameter("endDate");
			String startTime22 = getRequest().getParameter("startTime");
			String endTime22 = getRequest().getParameter("endTime");
			String startDate22 = getRequest().getParameter("startDate");
			//String weekDayTemp = getRequest().getParameter("weekDay");			
			HashMap<String, Calendar> calendarMap=calConfCalendar(startDate22,endDate22,startTime22,endTime22);
			Calendar startCalendar=(Calendar) calendarMap.get("startCalendar");
			Calendar endCalendar=(Calendar) calendarMap.get("endCalendar");			
			log.debug("countNum:"+countNum);
			if (isLong == 0) { //短期会议
			BoardRoom = boardRooService.searchBoRoomByTime(realStartTime, 
					realEndTime,0);//根据开始时间以及结束时间查询没有冲突的会议室列表
			}
			else if (isLong == 2) {//长期会议
				if (weekDay == 8) {//按天
				listForDate=bookSubConfDateList(2, -1, 2, startCalendar, endCalendar);						
				}else {	// 按周预定
				listForDate=bookSubConfDateList(1,countNum, 2, startCalendar, endCalendar);				
		     }
				BoardRoom = boardRooService.getAll();
                for (int tt = 0; tt < listForDate.size(); tt++) {					
				/*	list = boardRooService.searchUsedBoRoomByTime(
							listForDate.get(tt).getStartTime(), listForDate
									.get(tt).getEndTime());*/
                	list = boardRooService.searchBoRoomByTime(//根据开始时间以及结束时间查询没有冲突的会议室列表
							listForDate.get(tt).getStartTime(), listForDate
									.get(tt).getEndTime(),1);
					if (list.size() > 0) {//如果存在有冲突的会议室，则移除
						for (int rr = 0; rr < list.size(); rr++) {
                         	for (int ii = 0; ii < BoardRoom.size(); ii++) {
								if (list.get(rr).getRoomId() == BoardRoom
										.get(ii).getRoomId()) {
									BoardRoom.remove(ii);										
									break;
								}
							}	
						}
					}
				}					
		}
			StringBuffer bf = new StringBuffer("[");
			for (Boardroo br : BoardRoom) {
				bf.append("['").append(br.getRoomId()).append("','").append(
						br.getRoomname()).append("'],");
			}
			bf.deleteCharAt(bf.length() - 1).append("]");
			setJsonString(bf.toString());
		} catch (Exception e) {
			e.printStackTrace();
			setJsonString("{failure:true,msg:'系统异常'}");
		}
		log.info("完成查找会议室");
		return SUCCESS;
	}

	public String getPicBoardRoom() throws ParseException {
		Date now = new Date();
		HttpServletRequest request = getRequest();		
		String startTime01 = request.getParameter("startTime");
		String endTime01 = request.getParameter("endTime");
		String roomId = request.getParameter("roomId");
		Long roomID;
		if ((roomId == null) || roomId.equals("")) {
			roomID = new Long(-1);
		} else {
			roomID = new Long(roomId);
		}
		if ((startTime01 == null) || startTime01.equals("")) {
			startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000 * 1);
		} else {
			startTime01 = startTime01.replace("T", " ");
			startTime = DateUtils.parseDate(startTime01, new String[] {
					"yyyy-MM-dd", "yyyy-MM-dd HH:mm:ss" });
		}
		if ((endTime01 == null) || endTime01.equals("")) {
			endTime = new Date(now.getTime() + 24 * 60 * 60 * 1000 * 7);			

		} else {
			endTime01 = endTime01.replace("T", " ");
			endTime = DateUtils.parseDate(endTime01, new String[] {
					"yyyy-MM-dd", "yyyy-MM-dd HH:mm:ss" });
		}
		List<Conference> list = conferenceService.getPicBoardRoom(startTime,
				endTime, roomID);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
				.append(list.size()).append(",result:");
		JSONSerializer serializer = new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"),
				"startTime");
		serializer.transform(new DateTransformer("yyyy-MM-dd HH:mm:ss"),
				"endTime");		
		buff.append(serializer.exclude(new String[] { "class" })
				.serialize(list));
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
	}
	
	/**
	 * @description 保存短期会议申请;我发起的短期会议信息修改
	 * @author xintong 
	 * 
	 */
	public String temp() {
		log.info("保存短期会议");
		log.debug("roomId:"+conference.getRoomId()+" RoomName:"+conference.getRoomName()+" ConfId:"+conference.getConfId());
		//从页面获取数据
//		String leaderId = conference.getAttendUsers();//获取参加会议人员ID，现无用
		String confCont = conference.getConfContent();
		if("是否需要座牌栏位，如果需要，请填写座牌栏位信息！".equals(confCont)){
			conference.setConfContent(null);
		}
		
		//定义天数，根据用户属输入的会议天数计算结束日期
		//int number = 0;
		/*if(null != conference.getTimeNumber()){
			number = new Integer(conference.getTimeNumber().toString());
		}*/
		/*if(null == conference.getTimeNumber()){
			number = new Integer(conference.getTimeNumber().toString());
		}*/
		/*Date start = conference.getStartTime();
		Calendar c = Calendar.getInstance();
		c.setTime(start);
		c.add(Calendar.DATE, number);
		conference.setEndTime(c.getTime());*/
		
		/*String startDate = getRequest().getParameter("tempDate");//开始日期
		String startTime = getRequest().getParameter("tempStartTime");//开始时间
		String endDate = getRequest().getParameter("tempDate");//结束日期，因会议只能开一天，开始日期与结束日期相同
		String endTime = getRequest().getParameter("tempEndTime");//结束时间  */
//		String endDate=getRequest().getParameter("tempEndDate");//结束日期
//		String startTime = getRequest().getParameter("tempStartTime");//开始时间
//		String endTime = getRequest().getParameter("tempEndTime");//结束日期，开始日期与结束日期不同
//		String startDate = getRequest().getParameter("tempStartDate");//开始日期
		//转换日期，获取开始时间以及结束时间
				/*HashMap<String, Calendar> calendarMap=calConfCalendar(startDate,endDate,startTime,endTime);
				Calendar startCalendar=(Calendar) calendarMap.get("startCalendar");
				Calendar endCalendar=(Calendar) calendarMap.get("endCalendar");
				conference.setStartTime(startCalendar.getTime());
				conference.setEndTime(endCalendar.getTime());*/
		String startTime = getRequest().getParameter("tempStartTime");
		String endTime = getRequest().getParameter("tempEndTime");
		Date newStartTime = null;
		Date newEndTime = null;
		try {
			newStartTime = DateUtils.parseDate(startTime, new String[] {
					"yyyy-MM-dd HH:mm", "yyyy-MM-dd HH:mm" });
			newEndTime = DateUtils.parseDate(endTime, new String[] {
					"yyyy-MM-dd HH:mm", "yyyy-MM-dd HH:mm" });
		} catch (ParseException e1) {
			e1.printStackTrace();
		}
		Calendar startCalendar = Calendar.getInstance();
		startCalendar.setTime(newStartTime);
		startCalendar.set(Calendar.SECOND, 0);
		Calendar endCalendar = Calendar.getInstance();
		endCalendar.setTime(newEndTime);
		endCalendar.set(Calendar.SECOND, 0);
		conference.setStartTime(startCalendar.getTime());
		conference.setEndTime(endCalendar.getTime());
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
		Date startType = null;
		Date endType = null;
		try {
			startType = sdf.parse(sdf.format(newStartTime));
			endType = sdf.parse(sdf.format(newEndTime));
		} catch (ParseException e1) {
			e1.printStackTrace();
		}
		Long number = null;
		boolean amAndPmType = false;
		if(!startType.equals(endType)){
			startCalendar.setTime(startType);
			endCalendar.setTime(endType);
			number = (endCalendar.getTimeInMillis()-startCalendar.getTimeInMillis())/(1000*3600*24)+1;
			conference.setTimeType(2);
			conference.setTimeNumber(number);
		}else{
			if(amAndPmType){//根据真假来执行判断上下午的方法
				//如果结束时间的小时数为12则分钟数减1，已防止12点整时判断的上下午为下午
				if(12 == endCalendar.get(Calendar.HOUR_OF_DAY)){
					endCalendar.add(Calendar.MINUTE, -1);
				}
				//开始时间的上下午与结束时间的上下午相比较，如果相同取上午的上下午时间，如果不同则为整天，天数为1
				if(startCalendar.get(Calendar.AM_PM) == endCalendar.get(Calendar.AM_PM)){
					conference.setTimeType(startCalendar.get(Calendar.AM_PM));
				}else{
					conference.setTimeType(2);
					conference.setTimeNumber(new Long(1));
				}
			}else{
				/**
				 * 根据addHours和addMinutes来共同判断上下午addHours确定小时addMinutes确定分钟
				 * 例：若addHours=13,addMinutes=30则13点30分之前（包括13点30分）都为上午，超过为下午
				 * 目前上午为12点0分（包括12点0分）
				 */
				startCalendar.add(Calendar.HOUR, 12 - addHours);
				startCalendar.add(Calendar.MINUTE, - (addMinutes + 1));
				endCalendar.add(Calendar.HOUR, 12 - addHours);
				endCalendar.add(Calendar.MINUTE, - (addMinutes + 1));
				if(startCalendar.get(Calendar.AM_PM) == endCalendar.get(Calendar.AM_PM)){
					conference.setTimeType(startCalendar.get(Calendar.AM_PM));
				}else{
					conference.setTimeType(2);
					conference.setTimeNumber(new Long(1));
				}
				startCalendar.add(Calendar.HOUR, addHours - 12);
				startCalendar.add(Calendar.MINUTE, + (addMinutes + 1));
				endCalendar.add(Calendar.HOUR, addHours - 12);
				endCalendar.add(Calendar.MINUTE, + (addMinutes + 1));
			}
		}
				
		String msg = judgeBoardRoomNotUse();//判断会议申请时间是否有重复
		//为数据库必填字段添加默认值
		conference.setFeeBudget(new Double(1));
		conference.setStatus((short) 1);
		conference.setIsLong((short)0);
		Conference conference1 = new Conference();
		try {
			if (msg.equalsIgnoreCase("success")) {
				appuser1 = new AppUser();
				appuser1 = ContextUtil.getCurrentUser();
				conference.setUpdateBy(appuser1.getFullname());
				conference.setUpdateDate(new Date());
				if (conference.getConfId() == null) {
					//通知参加人
					/*if(null != leaderId && "" != leaderId.trim() && !leaderId.isEmpty()){
						List<AppUser> appUsers =  confAttendService.fliterLeader(leaderId);
						for (AppUser appuser : appUsers){
							LeaderActivities leaderActivities = new LeaderActivities();
							leaderActivities.setActiveName(conference.getConfTopic());
							leaderActivities.setActiveDesc(conference.getConfContent());
							leaderActivities.setStartTime(conference.getStartTime());
							leaderActivities.setEndTime(conference.getEndTime());
							leaderActivities.setCreateUser(appuser1.getFullname());
							leaderActivities.setCreateDate(new Date());
							leaderActivities.setAppUser(appuser);
						
							leaderActivitiesService.save(leaderActivities);
						}
					}*/
					
					//保存会议
					BeanUtil.copyNotNullProperties(conference, setBasicConference(conference));
					conference1 = conferenceService.temp(conference, viewer,
							updater, summary, filePath);
					saveToConfAttend(conference1);
				} else {
					Conference orgConference = conferenceService.get(conference
							.getConfId());
					BeanUtil.copyNotNullProperties(orgConference, conference);
					conference1 = conferenceService.save(orgConference);
					// 把ConfAttend表中的数据先删除在存入更新的数据
					Set<ConfAttend> setConf = conference1.getConfAttend();
					for (ConfAttend confAttend1 : setConf) {
						confAttendService.remove(confAttend1);
					}
					saveToConfAttend(conference1);
				}
				setJsonString("{success:true,confId:" + conference.getConfId() + "}");
			}
			else {
				setJsonString("{failure:true,msg:'" + msg + "'}");
			}
		} catch (Exception e) {
			log.fatal(e.getMessage());
			setJsonString("{failure:true,msg:'" + msg + "'}");
		}
		log.info("完成短期预定会议室");
		String sendConferenceMsg = getRequest().getParameter("sendConferenceMsg");
		Date curDate = new Date();
		SimpleDateFormat formatter=new SimpleDateFormat("yyyy-MM-dd HH:mm");
		String curDateStr = formatter.format(curDate);
		AppUser currentUser = ContextUtil.getCurrentUser();
		String content = "待办提醒:ＯＡ系统于"+curDateStr+"给您发送了会议申请：\""+conference.getConfTopic()+"\"，请您尽快审核。--系统自动发送";
		if ("true".equals(sendConferenceMsg)) {
			SysConfig conferenceCheckRoleId=sysConfigService.findByKey("conferenceCheckRoleId");
			if(conferenceCheckRoleId!=null){
				List<AppUser> auList=appUserService.searchUser(new Long(conferenceCheckRoleId.getDataValue()));
				for(AppUser au:auList){
					if(au.getMobile()!=null&&au.getMobile()!=""){
						SmsMobile sm=new SmsMobile();
						sm.setPhoneNumber(au.getMobile());
						sm.setRecipients(au.getFullname());
						sm.setRecipientsId(au);
						sm.setSendTime(new Date());
						sm.setSmsContent(content);
						sm.setStatus((short) 0);
						sm.setUserId(currentUser.getUserId());
						sm.setUserName(currentUser.getUsername());
						smsMobileService.save(sm);
					}
				}
			}
		}
		return SUCCESS;
	}
	
/**
 * @author f3225932
 * @category 保存长期预定会议室的数据
 *    页面传入参数：
 *                结束日期  tempEndDate 
 *                开始时间  tempStartTime 
 *                结束日期  tempEndTime 
 *                开始日期  tempStartDate
 *                预定方式   bookType：1为按周预定  2为按天预定 
 * @return SUCCESS
 * @throws ParseException
 */		
	public String bookRoomLong() throws ParseException {
		log.debug("进入长期预定会议室预定方法：");		
		List<Conference> listForDate=new ArrayList<Conference>();	
		//从页面获取数据
		String endDate=getRequest().getParameter("tempEndDate");//结束日期
		String startTime = getRequest().getParameter("tempStartTime");//开始时间
		String endTime = getRequest().getParameter("tempEndTime");//结束日期
		String startDate = getRequest().getParameter("tempStartDate");//开始日期		
		HashMap<String, Calendar> calendarMap=calConfCalendar(startDate,endDate,startTime,endTime);
		Calendar startCalendar=(Calendar) calendarMap.get("startCalendar");
		Calendar endCalendar=(Calendar) calendarMap.get("endCalendar");		
		try {			
			BeanUtil.copyNotNullProperties(conference, setBasicConference(conference));	//设置基本数据	
			//主要逻辑部分：
			// bookType==1表示按周预定
			log.debug("按周预定");
			if (bookType == 1) {
				listForDate=bookSubConfDateList(1,countNum,1,startCalendar,endCalendar);				
				}
			else if (bookType == 2) {//按天计算
				log.debug("按天预定");				
				listForDate=bookSubConfDateList(2,countNum,1,startCalendar,endCalendar);		
				countNum=8;				
			}
			int intMsg = isAgain(listForDate);//判断是否存在时间段的重复
			if (intMsg == 0) {
				String mag1 = "开会时间段已被他人选择，请协调！";
				setJsonString("{failure:true,msg:'" + mag1 + "'}");
				log.info("长期预定会议室预定方法：开会时间段已被他人选择");
				return SUCCESS;
			} else {
				conference.setStartTime(startCalendar.getTime());
				conference.setEndTime(endCalendar.getTime());
				saveParentAndSub(conference,listForDate,(short)countNum);	//按天计算的bookType				
				setJsonString("{success:true}");
			}			
		} catch (Exception e) {
			e.printStackTrace();
			setJsonString("{failure:true}");
		}
		log.info("完成长期预定会议室预定方法");
		return SUCCESS;
	}
	/**
	 * @author xintong
	 * @category 保存父会议记录以及计算后的子会议记录
	 * @param parentConference 父会议记录
	 * @param subConferenceList 子会议记录列表
	 */
	public void saveParentAndSub(Conference parentConference,List<Conference> subConferenceList,short bookType){
		log.info("保存父会议记录以及计算后的子会议记录");
		Conference newSubConference = new Conference();		
		parentConference.setApplyStatus((short) 1);
		parentConference.setIsLong((short) 2);// 长期预定会议室的父表
		parentConference.setBookType((short) bookType);//预定的星期/天数	
		Conference newParentConference = new Conference();
		newParentConference = conferenceService.save(parentConference);
		saveToConfAttend(newParentConference);
		for (int te = 0; te < subConferenceList.size(); te++) {
			Conference subConference = new Conference();
			subConference.setParentConfId(newParentConference.getConfId());//获取父表会议申请记录的会议Id
			subConferenceList.get(te).setParentConfId(newParentConference.getConfId());			
			newSubConference = conferenceService.save(subConferenceList
					.get(te));						
			saveToConfAttend(newSubConference);
		}	
		log.info("完成保存父会议记录以及计算后的子会议记录");
	}	
	/**
	 * @author xintong
	 * @category 保存会议参与人员
	 * @param conf1 会议对象
	 */
	public void saveToConfAttend(Conference conf1) {
		log.info("保存会议参与人员");
		// 向conf_attend插入一般参与人员记录
		if (conf1.getAttendUsers() != null && !conf1.getAttendUsers().isEmpty()) {			
			String attentId[] = conf1.getAttendUsers().split(",");
			for (int i = 0; i < attentId.length; i++) {
				confAttend = new ConfAttend();
				confAttend.setConfId(conf1);
				// 1：会议主席、2：会议记录人员、3：一般参与人员。
				confAttend.setUserType((short) 3);
				confAttend
						.setFullname(conf1.getAttendUsersName().split(",")[i]);				
				confAttend.setUserId(new Long(attentId[i]));
				confAttendService.save(confAttend);
			}
		}
		// 向conf_attend插入会议主席记录
		if (conf1.getCompere() != null && !conf1.getCompere().isEmpty()) {
			String compereId[] = conf1.getCompere().split(",");
			for (int i = 0; i < compereId.length; i++) {
				confAttend = new ConfAttend();
				confAttend.setConfId(conf1);
				// 1：会议主席、2：会议记录人员、3：一般参与人员。
				confAttend.setUserType((short) 1);
				confAttend.setFullname(conf1.getCompereName().split(",")[i]);
				confAttend.setUserId(new Long(compereId[i]));
				confAttendService.save(confAttend);
			}
		}
		// 向conf_attend插入记录人员记录
		if (conf1.getRecorder() != null && !conf1.getRecorder().isEmpty()) {
			String recorderId[] = conf1.getRecorder().split(",");
			for (int i = 0; i < recorderId.length; i++) {
				confAttend = new ConfAttend();
				confAttend.setConfId(conf1);
				// 1：会议主席、2：会议记录人员、3：一般参与人员。
				confAttend.setUserType((short) 2);
				confAttend.setFullname(conf1.getRecorderName().split(",")[i]);
				confAttend.setUserId(new Long(recorderId[i]));
				confAttendService.save(confAttend);
			}
		}
		if (null != conf1.getAttendDept() && !conf1.getAttendDept().isEmpty()){
			String attendDeptId[] = conf1.getAttendDept().split(",");
			for(int i = 0; i<attendDeptId.length; i++){
				confAttend = new ConfAttend();
				confAttend.setConfId(conf1);
				confAttend.setUserType((short) 99);
				confAttend.setFullname(conf1.getAttendDeptName().split(",")[i]);
				confAttend.setUserId(new Long(attendDeptId[i]));
				confAttendService.save(confAttend);
			}
		}
	}
	/**
	 * @author xintong
	 * @category 判断申请的日期是否跟数据库的存在的数据重复
	 * @param listForDate
	 * @return temp 1：不存在重复； 0：存在重复现象
	 */
	public int isAgain(List<Conference> listForDate) {
		log.info("判断申请的日期是否跟数据库的存在的数据重复");
		int temp = 0; //用于返回传入的会议时间是否重复
		for (int j = 0; j < listForDate.size(); j++) {
			String mgs = conferenceService.judgeBoardRoomNotUse(listForDate
					.get(j).getParentConfId(), listForDate.get(j)
					.getStartTime(), listForDate.get(j).getEndTime(),
					listForDate.get(j).getRoomId(), listForDate.get(j)
					.getStartTime(), listForDate.get(j).getEndTime());
			log.info("保存会议参与人员j:"+j+ "  ;mss:"+mgs);			
			if (mgs.equalsIgnoreCase("success")) {
				temp = 1;
			} else {
				temp = 0;
			}
			if (temp == 0)				
				return temp; //break;
		}
		return temp;
	}

	/**
	 * @author xintong
	 * @category 长期会议子表审批
	 * @param checkValue 审批值：表示是否通过，退回等
	 * @param statusValue 审批后的status值：退回以及通过都是0，取消是1
	 */	
	public void longConfCheck(int checkValue, int statusValue) {
		try {
			log.info("长期会议子笔审批");			
			// 获取长期会议的相关的子会议
			List<Conference> subList = conferenceService
					.getLongConfSub(conference.getConfId());
			for (int ie = 0; ie < subList.size(); ie++) {
				log.debug("int ie:"+ie);
				Conference confTemp = new Conference();
				confTemp.setCheckReason(conference.getCheckReason());
				confTemp.setCheckName(appuser1.getFullname());
				confTemp.setCheckUserId(appuser1.getUserId());
				confTemp.setApplyStatus((short) checkValue);
				confTemp.setStatus((short) statusValue);
				BeanUtil.copyNotNullProperties(subList.get(ie), confTemp);				
				conferenceService.save(subList.get(ie));				
			}
			setJsonString("{success:true}");
		} catch (Exception e) {
			e.printStackTrace();
			setJsonString("{failure:true,msg:'对不起，会议审核失败！'}");			
		}
	}

	/**
	 * @author f3225932
	 * @category 只用于会议室调整中对原父表以及子表更新：改变已经存在的conference父记录,以及删除子记录
	 * @return
	 */
	public String longConfAdjust() {
		log.info("长期会议室调整：更新父记录，删除子记录");
		try {
			Conference orgConference11 = conferenceService.get(conference
					.getConfId());
			String msg = conferenceService.delSubConf(conference.getConfId());// 删除某会议的所有未完成的子会议
			Conference conf1 = new Conference();
			appuser1 = new AppUser();
			appuser1 = ContextUtil.getCurrentUser();
			conf1.setApplyStatus((short) -1);
			conf1.setUpdateBy(appuser1.getUsername());
			conf1.setUpdateDate(new Date());
			conf1.setEndTime(new Date());
			BeanUtil.copyNotNullProperties(orgConference11, conf1);
			conferenceService.save(orgConference11); // 更新父会议
			if (!msg.equalsIgnoreCase("success")) {
				String mag1 = "数据库操作失败！";
				setJsonString("{failure:true,msg:'" + mag1 + "'}");
			}
		} catch (Exception e) {
			e.printStackTrace();
			String mag1 = "长期会议调整异常！";
			setJsonString("{failure:true,msg:'" + mag1 + "'}");
		}
		log.info("完成长期会议室调整：更新父记录，删除子记录");
		return SUCCESS;
	}
	/**
	 * @author f3225932
	 * @category 管理员对审核通过的会议调整
	 * @return
	 * @throws IllegalAccessException
	 * @throws InvocationTargetException
	 */
	public String updateLongConf() throws IllegalAccessException, InvocationTargetException{
		log.info("管理员对审核通过的会议调整");
		AppUser appUser = ContextUtil.getCurrentUser();
		Conference conference1 = new Conference();
		List<Conference> listForDate = new ArrayList<Conference>();		
		String endDate22 = getRequest().getParameter("endDate");
		String startTime22 = getRequest().getParameter("startTime");
		String endTime22 = getRequest().getParameter("endTime");
		String startDate22 = getRequest().getParameter("startDate");	
		HashMap<String, Calendar> calendarMap=calConfCalendar(startDate22,endDate22,startTime22,endTime22);
		Calendar startCalendar=(Calendar) calendarMap.get("startCalendar");
		Calendar endCalendar=(Calendar) calendarMap.get("endCalendar");			
		if(isLong==0){//短期会议室的调整			
			Conference orgConference = conferenceService.get(conference
					.getConfId());//获取该会议的所有信息
			appuser1 = new AppUser();
			appuser1 = ContextUtil.getCurrentUser();
			conference.setStartTime(startCalendar.getTime());//新的开始时间
			conference.setEndTime(endCalendar.getTime());//新的介绍时间
			conference.setCheckName(appuser1.getFullname());//设置审核人名字
			conference.setCheckUserId(appuser1.getUserId());//设置审核人id
			conference.setApplyStatus((short) 2);//将审批状态改为已审核
			BeanUtil.copyNotNullProperties(orgConference, conference);//拷贝conference的信息到orgConference中
			conferenceService.save(orgConference); // 更新非长期会议室
			setJsonString("{success:true}");				
		}
		else{//长期会议室的调整
			if (conference.getConfId() != null) {			
				Conference newconference1 = new Conference();
				Conference newconference2 = new Conference();
				newconference1 = conferenceService.get(conference.getConfId());
				newconference2.setApplyStatus((short) 2);
				newconference2.setStatus((short) 0);
				newconference2.setFeeBudget(new Double(0));
				newconference2.setTypeId(newconference1.getTypeId());
				newconference2.setBookType((short) countNum);
				newconference2.setConfContent(newconference1.getConfContent());
				newconference2.setConfTopic(newconference1.getConfTopic());
				newconference2.setApplicantId(newconference1.getApplicantId());			
				newconference2.setAttendUsers(newconference1.getAttendUsers());
				newconference2.setAttendUsersName(newconference1
						.getAttendUsersName());		
				newconference2.setCheckName(appUser.getFullname());
				newconference2.setCheckReason(conference.getCheckReason());
				newconference2.setCheckUserId(appUser.getUserId());
				newconference2.setCompere(newconference1.getCompere());
				newconference2.setCompereName(newconference1.getCompereName());
				newconference2.setCreateBy(newconference1.getCreateBy());
				newconference2.setImportLevel(newconference1.getImportLevel());
				newconference2.setUpdateDate(new Date());
				newconference2.setUpdateBy(appUser.getUsername());			
				newconference2.setRoomName(conference.getRoomName());
				newconference2.setRoomId(conference.getRoomId());
				System.out.println("ConfProperty:"+newconference1.getConfProperty());
				newconference2.setConfProperty(newconference1.getConfProperty());
				newconference2.setBookType((short) countNum);
				newconference2.setRecorder(newconference1.getRecorder());
				newconference2.setRecorderName(newconference1.getRecorderName());
				newconference2.setIsEmail((short) 0);
				newconference2.setIsMobile((short) 0);			
				if (countNum == 8) {
					// 长期会议室按天预定			
					listForDate=bookSubConfDateList(2,-1,2,startCalendar, endCalendar);//-1：按天预定任意数						
					countNum=8;
				} else {
					// 长期会议室按星期预定
					listForDate=bookSubConfDateList(1, countNum,2,startCalendar, endCalendar);								
				}
				int intMsg = isAgain(listForDate);
				if (intMsg == 0) {
					String mag1 = "开会时间段已被他人选择，请协调！";
					setJsonString("{failure:true,msg:'" + mag1 + "'}");
					return SUCCESS;
				} else {
					Conference parentConference = new Conference();				
					newconference2.setStartTime(startCalendar.getTime());
					newconference2.setEndTime(endCalendar.getTime());
					newconference2.setApplyStatus((short) 2);
					newconference2.setIsLong((short) 2);// 表示是长期预定会议室的parent表
					newconference2.setBookType((short) countNum);
					BeanUtil.copyNotNullProperties(parentConference,
							newconference2);
					Conference conf_01 = new Conference();
					conf_01 = conferenceService.save(parentConference);					
					saveToConfAttend(conf_01);
					for (int te = 0; te < listForDate.size(); te++) {
						System.out.println("conf_01.getConfId:"+conf_01.getConfId());
						listForDate.get(te)
								.setParentConfId(conf_01.getConfId());						
						conference1 = conferenceService.save(listForDate
								.get(te));		//保存子会议				
						saveToConfAttend(conference1);
					}
				}
			}
			if (conference.getConfId() != null) {
				// 删除未完成的子会议室以及更新父会议室的申请状态为-1，以及endTime为最新的日期
				log.info("长期会议室调整更新父会议室");
							longConfAdjust();
			} 
		}	
		log.info("完成管理员对审核通过的会议调整");
		return SUCCESS;
	}
	
	/**
	 * @author f3225932
	 * @category  由我发起的申请中的长期会议调整：Update父记录，新生成子记录，删除旧子记录
	 * @return
	 * @throws ParseException
	 */
	public String myLongConfAdjust() throws ParseException {
		log.info("由我发起的申请中的长期会议调整");
		Conference conference1 = new Conference();
		List<Conference> listForDate = new ArrayList<Conference>();		
		AppUser appUser = ContextUtil.getCurrentUser();
		String endDate22 = getRequest().getParameter("tempEndDate");
		String startTime22 = getRequest().getParameter("tempStartTime");
		String endTime22 = getRequest().getParameter("tempEndTime");
		String startDate22 = getRequest().getParameter("tempStartDate");				
		HashMap<String, Calendar> calendarMap=calConfCalendar(startDate22,endDate22,startTime22,endTime22);
		Calendar startCalendar=(Calendar) calendarMap.get("startCalendar");
		Calendar endCalendar=(Calendar) calendarMap.get("endCalendar");			
		Conference newconference = new Conference();
		newconference = conferenceService.get(conference.getConfId());		
		try {			
				if (bookType == 1) {// bookType==1表示按周预定
				   listForDate=bookSubConfDateList(1,countNum,1,startCalendar, endCalendar);//按周预定	
				}
				else if (bookType == 2){// 按天						
					listForDate=bookSubConfDateList(2,-1,1,startCalendar, endCalendar);//-1：按天预定任意数						
					countNum=8;						
				}				
				int intMsg = isAgain(listForDate);
				if (intMsg == 0) {
					String mag1 = "开会时间段已被他人选择，请协调！";
					setJsonString("{failure:true,msg:'" + mag1 + "'}");
					return SUCCESS;
				} else {
					if (conference.getConfId() != null) {
						// 删除子记录
						String msg = conferenceService.delSubConf(conference
								.getConfId());
					}
					conference.setStartTime(startCalendar.getTime());
					conference.setEndTime(endCalendar.getTime());
					conference.setApplyStatus((short) 1);
					conference.setIsLong((short) 2);// 表示是长期预定会议室的parent表
					conference.setBookType((short) countNum);
					conference.setStatus((short) 0);
					conference.setUpdateBy(appUser.getUsername());
					conference.setUpdateDate(new Date());
					BeanUtil.copyNotNullProperties(newconference, conference);
					Conference conference11 = new Conference();
					conference11 = conferenceService.save(newconference);
					saveToConfAttend(conference11);
					for (int te = 0; te < listForDate.size(); te++) {
						listForDate.get(te).setParentConfId(
								conference11.getConfId());
						conference1 = conferenceService.save(listForDate
								.get(te));
						saveToConfAttend(conference1);
					}
				}	
				setJsonString("{success:true}");			
		}catch (Exception e) {
			e.printStackTrace();
			setJsonString("{failure:true}");
		}
		log.info("完成由我发起的申请中的长期会议调整");
		return SUCCESS;
	}
	
	/**
	 * @author xintong
	 * @category 将传入的dateDay转换成相应的星期几
	 * @param dateDay
	 * @return 一二三四五六日
	 */
public String getXingQi(int dateDay){
	   //转换星期
	String stringDate="";
	switch(dateDay){	
		case 1:  stringDate="一";
		break;
		case 2:  stringDate="二";
		break;
		case 3:  stringDate="三";
		break;
		case 4:  stringDate="四";
		break;
		case 5:  stringDate="五";
		break;
		case 6:  stringDate="六";
		break;
		case 7:  stringDate="日";
		break;
		default: 
			stringDate="";
		break;	
	}
	return stringDate;	
}

/**
 * @author xintong
 * @category 将页面传入的开始/结束时间 以及日期进行转换
 * @param startDate
 * @param endDate
 * @param startTime
 * @param endTime
 * @return 	Map：存有开始时间，以及最后的结束时间的HashMap
 */

public HashMap<String, Calendar> calConfCalendar(String startDate,String endDate ,String startTime,String endTime){
	log.info("计算会议开始时间以及结束时间");
	HashMap<String,Calendar> CalendarMap=new HashMap<String, Calendar>();	
	//拼成日期格式
			String realStartDateString=startDate+" "+startTime;//拼好后的开始日期
			String realEndDateString=endDate+" "+endTime;//拼好后的结束日期
			Date startDate1 = null;//开始日期转换为date型的初始化
			Date endDate1 = null;//结束日期转换为date型的初始化
			//将开始日期以及结束日期从string转换成date
			try {
				startDate1 = DateUtils.parseDate(realStartDateString, new String[] {
						"yyyy-MM-dd HH:mm", "yyyy-MM-dd HH:mm" });//开始日期
				endDate1 = DateUtils.parseDate(realEndDateString, new String[] {
						"yyyy-MM-dd HH:mm", "yyyy-MM-dd HH:mm" });//结束日期
			} catch (Exception e) {
				// TODO: handle exception 日期转换异常
				log.warn(e);
			}       
			//将值传入calendar中：构造考勤日期，分，秒必须为0
			Calendar startCalendar = Calendar.getInstance();
			startCalendar.setTime(startDate1);	
			startCalendar.set(Calendar.SECOND, 0);
			startCalendar.set(Calendar.MILLISECOND, 0);
			Calendar endCalendar = (Calendar) startCalendar.clone();
			endCalendar.setTime(endDate1);	
			endCalendar.set(Calendar.SECOND, 0);
			endCalendar.set(Calendar.MILLISECOND, 0);	
			CalendarMap.put("startCalendar", startCalendar);
			CalendarMap.put("endCalendar", endCalendar);
			log.info("完成会议开始时间以及结束时间："+CalendarMap);
	return CalendarMap;
}
/**
 * @author xintong
 * @category 将传入的会议对象设置初始值
 * @param newConferece
 * @return 设置初始值后的会议对象
 */
public Conference setBasicConference( Conference newConferece){
	log.info("设置会议基本信息");
	AppUser appUser = ContextUtil.getCurrentUser();
	if (newConferece.getConfId() == null) {
		if (newConferece.getIsEmail() == null)//没有要求发送邮件，为了以后扩充邮件模块
			newConferece.setIsEmail(Conference.ISNOEMAIL);
		if (newConferece.getIsMobile() == null)//没有要求发送短信，为了以后扩充邮件短信
			newConferece.setIsMobile(Conference.ISNOMOBILE);
		newConferece.setStatus(Conference.TEMP);//状态是未发送
		newConferece.setApplicantId(appUser.getUserId()); //申请人					
		newConferece.setFeeBudget(0.0); // 花费默认为0
		newConferece.setApplyStatus(Conference.Apply);//Apply:申请状态
		newConferece.setCreateBy(appUser.getFullname());//创建人
		newConferece.setCreateDate(new Date());	//创建日期		
	   }
	log.info("完成设置会议基本信息");
	return newConferece;
}	
/**
 * @author f3225932
 * @category 计算长期会议的子会议时间
 * @param type 预定的类型：1按星期，2按连续天数
 * @param days 按星期预定时表示预定的星期，(按天数预定时表示预定的天数,可任意传)
 * @param  applyStatus 表示申请状态:1表示申请，2审核通过
 * @param startCalendar 会议的时间开始时间
 * @param endCalendar 会议的时间结束时间
 * @return  会议室预定的子会议列表
 * @throws IllegalAccessException
 * @throws InvocationTargetException
 */
public List<Conference> bookSubConfDateList(int type,int days,int applyStatus,Calendar startCalendar,Calendar endCalendar ) throws IllegalAccessException, InvocationTargetException{
	Conference newSubconference = new Conference();
	Conference newOrgSubconference = new Conference();
	if(conference!=null){//会议不为空的时候进行赋值
		if(null==conference.getConfId()){//如果是新增的功能的时候
			newSubconference=conference;
		}else{//如果是调整、修改，会议室Id不为空	
			
			newOrgSubconference=conferenceService.get(conference.getConfId());
			BeanUtil.copyNotNullProperties(newOrgSubconference, conference);	
			AppUser appUser = ContextUtil.getCurrentUser();	
			newSubconference.setApplyStatus((short) applyStatus);
			newSubconference.setStatus((short) 0);
			newSubconference.setFeeBudget(new Double(0));
			newSubconference.setTypeId(newOrgSubconference.getTypeId());
			newSubconference.setBookType((short) countNum);
			newSubconference.setConfContent(newOrgSubconference.getConfContent());
			newSubconference.setConfTopic(newOrgSubconference.getConfTopic());
			newSubconference.setApplicantId(appUser.getUserId());	
			newSubconference.setAttendUsers(newOrgSubconference.getAttendUsers());
			newSubconference.setAttendUsersName(newOrgSubconference.getAttendUsersName());		
			newSubconference.setCompere(newOrgSubconference.getCompere());
			newSubconference.setCompereName(newOrgSubconference.getCompereName());
			newSubconference.setCreateBy(appUser.getUsername());
			newSubconference.setImportLevel(newOrgSubconference.getImportLevel());
			newSubconference.setUpdateDate(new Date());
			newSubconference.setUpdateBy(appUser.getUsername());	
			newSubconference.setRoomName(newOrgSubconference.getRoomName());
			newSubconference.setRoomId(newOrgSubconference.getRoomId());
			newSubconference.setConfProperty(newOrgSubconference.getConfProperty());
			newSubconference.setBookType((short) countNum);
			newSubconference.setRecorder(newOrgSubconference.getRecorder());
			newSubconference.setRecorderName(newOrgSubconference.getRecorderName());
			newSubconference.setIsEmail((short) 0);
			newSubconference.setIsMobile((short) 0);
			newSubconference.setParentConfId(newOrgSubconference.getConfId());
			newSubconference.setCreateDate(new Date());	
		}		
	}	
	List<Conference> listForDate=new ArrayList<Conference>();
	Calendar startTimeSave = Calendar.getInstance();//用于计算实际子会议记录的开始时间
	startTimeSave = (Calendar) startCalendar.clone();
	Calendar startDateEndTimeCalendar = Calendar.getInstance();//用于计算实际子会议记录的结束时间
	//按星期	
	if(type==1){		
		log.debug("按每周"+(startCalendar.get(Calendar.DAY_OF_WEEK)-1)+"进行预定");
		int isday =startCalendar.get(Calendar.DAY_OF_WEEK)-1; //isday表示的是每个星期的星期几，例星期2，则isday的值是2；星期日，它的值是0
	
		if (isday == 0) {//如果选择的是按每周日进行预定
			isday = 7;//将isday的值改为7（保存数据库）
		}
		/*// 开始时间的星期与选择的周期一致
		if (isday == countNum) {//countNum是前台传入的按星期countNum进行预定
			startTimeSave = (Calendar) startCalendar.clone();					
		}*/		
		log.debug("countNum:"+days);				
		if(isday != days){
			//开始时间的星期与选择的不一致
			startTimeSave=	(Calendar) startCalendar.clone();
			if((days - isday)>0){				
				log.debug("进行预定>0");
				startTimeSave.add(Calendar.DAY_OF_MONTH,(days - isday));//预定的周期比实际开始的周期大
			}
			else
			{	log.debug("进行预定<0");
			startTimeSave.add(Calendar.DAY_OF_MONTH,(7-isday+days ));//预定的周期比实际开始的周期小						
		    }	
		}
		startDateEndTimeCalendar = (Calendar) startTimeSave.clone();
		startDateEndTimeCalendar.set(Calendar.HOUR_OF_DAY, endCalendar.get(Calendar.HOUR_OF_DAY));
		startDateEndTimeCalendar.set(Calendar.MINUTE, endCalendar.get(Calendar.MINUTE));
		log.debug("最后的计算日期跟实际选择的日期做比较："+startDateEndTimeCalendar.compareTo(endCalendar));
		while (startDateEndTimeCalendar.compareTo(endCalendar)<=0) {//当开始时间不大于结束时间的时候
			log.debug("startTimeSave:"+startTimeSave);
			log.debug("startDateEndTimeCalendar:"+startDateEndTimeCalendar);
			Conference newconference = new Conference();					
			newSubconference.setStartTime(startTimeSave.getTime());
			newSubconference.setEndTime(startDateEndTimeCalendar.getTime());
			newSubconference.setApplyStatus((short) applyStatus);//申请状态
			newSubconference.setIsLong((short) 1);//保存长期会议室的子笔数据					
			newSubconference.setBookType((short) days);//保存会议的预定周期
			BeanUtil.copyNotNullProperties(newconference, newSubconference);					
			listForDate.add(newconference);//将子笔数据存入list中，以便在时间段通过后存入数据库
			startTimeSave.add(Calendar.DAY_OF_MONTH, 7); //计算下一次周期的开始时间
			startDateEndTimeCalendar.add(Calendar.DAY_OF_MONTH, 7);//计算下一次周期的结束时间	
			}			
	}else if(type==2){//按天		
		log.debug("按天预定");
		listForDate = new ArrayList<Conference>();				
		startDateEndTimeCalendar = (Calendar) startCalendar.clone();
		startDateEndTimeCalendar.set(Calendar.HOUR_OF_DAY, endCalendar.get(Calendar.HOUR_OF_DAY));
		startDateEndTimeCalendar.set(Calendar.MINUTE, endCalendar.get(Calendar.MINUTE));
		while (startTimeSave.compareTo(endCalendar)<0) {
			log.info("startTimeSave:"+startTimeSave+" ;startDateEndTimeCalendar:"+startDateEndTimeCalendar);
			Conference newconference = new Conference();
			newSubconference.setStartTime(startTimeSave.getTime());
			newSubconference.setEndTime(startDateEndTimeCalendar.getTime());
			newSubconference.setApplyStatus((short) applyStatus);
			newSubconference.setIsLong((short) 1);//子会议记录
			newSubconference.setBookType((short) 8);//8：按天计算
			BeanUtil.copyNotNullProperties(newconference, newSubconference);
			listForDate.add(newconference);//将计算的数据存入list列表中
			startTimeSave.add(Calendar.DAY_OF_MONTH, 1); //计算第二天的开始时间
			startDateEndTimeCalendar.add(Calendar.DAY_OF_MONTH, 1);//计算第二天的结束时间					
		}		
	}
	log.info("完成计算长期会议的子会议时间。列表："+listForDate);	
	return listForDate;		
	}

	/**
	 * 根据传进来的会议ID、要修改的会议状态，修改会议状态
	 * @return
	 */
	public String changeStatus(){
		try {
			String applyStatus = getRequest().getParameter("applyStatus");
			String confId = getRequest().getParameter("confId");
			Conference conf11=new  Conference();
			String str="";
			short applyStatus1 = Short.parseShort(applyStatus);//将获取会议状态的String类型转换为short类型
			System.out.println(applyStatus1);
			if(null != confId){
				Conference orgConference = conferenceService.get(new Long(confId));//获取该会议的所有信息	
				orgConference.setApplyStatus(applyStatus1);
				orgConference.setUpdateBy(ContextUtil.getCurrentUser().getFullname());
				orgConference.setUpdateDate(new Date());
				//BeanUtil.copyNotNullProperties(orgConference, conference);//拷贝conference的信息到orgConference中
				conf11=conferenceService.save(orgConference); // 非长期会议室以及长期会议的父表的审批，并返回审批后的会议信息				
				setJsonString("{success:true}");
				log.debug(str);				
			}else{
				setJsonString("{failure:true,msg:'对不起，会议审核失败！'}");
				log.debug(str);
			}

		} catch (Exception ex) {
			ex.printStackTrace();
			log.error(ex.getMessage());
			setJsonString("{failure:true,msg:'对不起，会议审核失败！'}");
		}
		return SUCCESS;
	}
	
	/**
	 * 将传过来的YYYY-mm-dd HH:MM更改为时间类型,返回Calendar类型
	 * @param startTime传入的初始时间
	 * @return
	 */
	private Calendar calendar(String startTime){
		Date newStartTime = null;
		try {
			newStartTime = DateUtils.parseDate(startTime, new String[] {
					"yyyy-MM-dd HH:mm", "yyyy-MM-dd HH:mm" });
		} catch (ParseException e) {
			e.printStackTrace();
		}
		Calendar cal = Calendar.getInstance();
		cal.setTime(newStartTime);
		cal.set(Calendar.SECOND, 0);
		return cal;
	}
	
	/**
	 * 取传入时间的年月日，获得新的时间
	 * @param date
	 * @return
	 */
	private Calendar formatDate(Date date){
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd");
		Calendar calendar = Calendar.getInstance();
		try {
			Date formatDate = sdf.parse(sdf.format(date));
			calendar.setTime(formatDate);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return calendar;
	}
	
	/**
	 * 根据特定上下午设置修改时间
	 * @param time传进来的开始时间或结束时间
	 */
	private Date subDate(Date time){
		Calendar cal = Calendar.getInstance();
		cal.setTime(time);
		cal.add(Calendar.HOUR, 12 - addHours);
		cal.add(Calendar.MINUTE, -(addMinutes+1));
		return cal.getTime();
	}
	private Calendar subDate(Calendar time){
		time.add(Calendar.HOUR, 12 - addHours);
		time.add(Calendar.MINUTE, -(addMinutes+1));
		return time;
	}
	
	/**
	 * 将Calendar时间类型还原
	 * @param time
	 * @return
	 */
	private Calendar addDate(Calendar time){
		time.add(Calendar.HOUR, addHours - 12);
		time.add(Calendar.MINUTE, + (addMinutes + 1));
		return time;
	}
	
	/**
	 * 根据开始时间和结束时间对时间进行处理，方便会议室预定和修改时判断会议室是否已有预定
	 * @param time根据上下午修改过的时间
	 * @param isStart判断传进来的是开始时间还是结束时间true表示开始,false表示结束
	 * @return
	 */
	private Date compareTime(Date time, Boolean isStart){
		Date nowTime = subDate(time);
		Calendar cal = Calendar.getInstance();
		cal.setTime(nowTime);
		if(isStart){
			if(0 == cal.get(Calendar.AM_PM)){//0代表上午，1代表下午
				cal.set(Calendar.HOUR_OF_DAY, 0);
			}else{
				cal.set(Calendar.HOUR_OF_DAY, 12);
				cal.set(Calendar.MINUTE, 1);
			}
		}else{
			if(0 == cal.get(Calendar.AM_PM)){//0代表上午，1代表下午
				cal.set(Calendar.HOUR_OF_DAY, 12);
			}else{
				cal.set(Calendar.HOUR_OF_DAY, 0);
				cal.add(Calendar.DATE, 1);
			}
		}
		cal.set(Calendar.MINUTE, 0);
		cal.add(Calendar.HOUR, 12 - addHours);//if判断后时间和分钟设定过特殊值，需要重新修改
		if(isStart){
			cal.add(Calendar.MINUTE, - addMinutes);
		}else{
			cal.add(Calendar.MINUTE, - (addMinutes + 1));
		}
		return cal.getTime();
	}
}