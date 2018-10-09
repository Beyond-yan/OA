package com.gdssoft.oa.action.api;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;

import org.apache.commons.lang.StringUtils;
import org.apache.velocity.app.VelocityEngine;
import org.jbpm.api.ProcessInstance;
import org.jbpm.api.task.Task;
import org.jbpm.pvm.internal.task.ParticipationImpl;
import org.jbpm.pvm.internal.task.TaskImpl;
import org.springframework.security.AuthenticationManager;
import org.springframework.security.context.SecurityContext;
import org.springframework.security.context.SecurityContextHolder;
import org.springframework.security.providers.UsernamePasswordAuthenticationToken;
import org.springframework.security.ui.webapp.AuthenticationProcessingFilter;

import com.gdssoft.core.engine.MailEngine;
import com.gdssoft.core.jbpm.pv.ParamField;
import com.gdssoft.core.log.CustomerLog;
import com.gdssoft.core.util.ApiUtils;
import com.gdssoft.core.util.AppUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.StringUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.action.flow.CurrentTaskHelper;
import com.gdssoft.oa.action.flow.FlowRunInfo;
import com.gdssoft.oa.action.flow.ProcessActivityAssistant;
import com.gdssoft.oa.action.flow.ProcessFormReq;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.flow.JbpmTask;
import com.gdssoft.oa.model.flow.ProDefinition;
import com.gdssoft.oa.model.flow.ProcessRun;
import com.gdssoft.oa.model.leaderActivities.LeaderActivities;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.model.system.FileAttach;
import com.gdssoft.oa.model.system.SysArchivesFiles;
import com.gdssoft.oa.model.system.SysArchivesFilesHis;
import com.gdssoft.oa.model.system.SysMessage;
import com.gdssoft.oa.service.admin.ConferenceService;
import com.gdssoft.oa.service.archive.ArchivesDepService;
import com.gdssoft.oa.service.archive.ArchivesDocService;
import com.gdssoft.oa.service.archive.ArchivesService;
import com.gdssoft.oa.service.communicate.SmsMobileService;
import com.gdssoft.oa.service.flow.CcuserProcessService;
import com.gdssoft.oa.service.flow.JbpmService;
import com.gdssoft.oa.service.flow.ProDefinitionService;
import com.gdssoft.oa.service.flow.ProcessFormService;
import com.gdssoft.oa.service.flow.ProcessRunService;
import com.gdssoft.oa.service.flow.TaskAgentService;
import com.gdssoft.oa.service.leaderActivities.LeaderActivitiesService;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.oa.service.system.DepartmentService;
import com.gdssoft.oa.service.system.DocDirectoryService;
import com.gdssoft.oa.service.system.DocFilesService;
import com.gdssoft.oa.service.system.FileAttachService;
import com.gdssoft.oa.service.system.SysArchivesFilesHisService;
import com.gdssoft.oa.service.system.SysArchivesFilesService;
import com.gdssoft.oa.service.system.SysConfigService;
import com.gdssoft.oa.service.system.SysDataTransferService;
import com.gdssoft.oa.service.system.SysDepartmentConfigService;
import com.gdssoft.oa.service.system.SysMessageService;
import com.gdssoft.oa.service.system.SysUserAllService;
import com.gdssoft.oa.util.IMUtil;
import com.gdssoft.oa.util.SyncUtil;

public class FlowApiAction extends BaseAction {
	@Resource
	private ArchivesDocService archivesDocService;
	@Resource
	private ConferenceService conferenceService;
	@Resource
	private DocFilesService docFilesService;
	@Resource
	private DocDirectoryService docDirectoryService;
	@Resource
	private SmsMobileService smsMobileServie;
	@Resource
	private ArchivesDepService archivesDepService;
	@Resource
	private ArchivesService archivesService;
	@Resource
	private LeaderActivitiesService leaderActivitiesService;
	@Resource
	private SysArchivesFilesService sysArchivesFilesService;
	@Resource
	private ProcessRunService processRunService;
	@Resource
	private ProcessFormService processFormService;
	@Resource
	CcuserProcessService ccuserProcessService;
	@Resource
	private TaskAgentService taskAgentService;
	@Resource
	private ProDefinitionService proDefinitionService;
	@Resource
	private MailEngine mailEngine;
	@Resource
	private SmsMobileService smsMobileService;
	@Resource
	private VelocityEngine velocityEngine;
	@Resource
	private JbpmService jbpmService;
	@Resource
	private SysUserAllService sysUserAllService;
	@Resource
	private SysDepartmentConfigService sysDepartmentConfigService;
	@Resource
	private SysDataTransferService sysDataTransferService;
	@Resource
	private AppUserService appUserService;
	@Resource(name = "flowTaskService")
	private com.gdssoft.oa.service.flow.TaskService flowTaskService;

	@Resource
	private SysConfigService sysConfigService;
	@Resource(name = "authenticationManager")
	private AuthenticationManager authenticationManager = null;
	@Resource
	private FileAttachService fileAttachService;
	@Resource
	private AppUserService userService;
	@Resource
	private DepartmentService departmentService;
	@Resource
	private SysMessageService messageService;

	public String saveAgentRecvFlow() {
		String itemKey = getRequest().getParameter("itemKey");
		String flowSendDept = getRequest().getParameter("flowSendDept");// 发文部门
		String flowRecvDept = getRequest().getParameter("flowRecvDept");// 接受部门
		String flowType = getRequest().getParameter("flowType");// 收文类型
		String flowSecret = getRequest().getParameter("flowSecret");// 密级
		String flowPriority = getRequest().getParameter("flowPriority");// 缓急
		String flowNo = getRequest().getParameter("flowNo");// 编号
		String flowTitle = getRequest().getParameter("flowTitle");// 标题
		String flowContent = getRequest().getParameter("flowContent");// 内容
		String flowFileIds = getRequest().getParameter("flowFileIds");// 附件

		Map<String, Object> paramMap = new HashMap<String, Object>();
		paramMap.put("flowSendDept", flowSendDept);
		paramMap.put("flowRecvDept", flowRecvDept);
		paramMap.put("itemKey", itemKey);
		paramMap.put("flowType", flowType);
		paramMap.put("flowSecret", flowSecret);
		paramMap.put("flowPriority", flowPriority);
		paramMap.put("flowNo", flowNo);
		paramMap.put("flowTitle", flowTitle);
		paramMap.put("flowContent", flowContent);
		paramMap.put("flowFileIds", flowFileIds);

		String code = "0", msg = "成功！";
		try {
			if (StringUtils.isBlank(flowSendDept)
					|| StringUtils.isBlank(flowRecvDept)
					|| StringUtils.isBlank(flowType)
					|| StringUtils.isBlank(flowSecret)
					|| StringUtils.isBlank(flowPriority)
					|| StringUtils.isBlank(flowNo)
					|| StringUtils.isBlank(flowTitle)) {
				code = "1";
				msg = "参数错误！";
			}

		} catch (Exception e) {
			e.printStackTrace();
			code = "1";
			msg = "失败！";
		}
		StringBuffer buff = new StringBuffer("{'code':").append(code)
				.append(",'msg':").append(msg);
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
	}

	public String queryLeaderAgenda() {
		String beginDateStr = getRequest().getParameter("beginDate");
		String endDateStr = getRequest().getParameter("endDate");
		String schamal = getRequest().getParameter("schamal");
		Date beginDate = null, endDate = null;
		if (StringUtils.isNotBlank(beginDateStr)) {
			beginDate = ApiUtils.parseDate(beginDateStr);
		}
		if (StringUtils.isNotBlank(endDateStr)) {
			endDate = ApiUtils.parseDate(endDateStr);
			if (endDate != null) {
				endDate = ApiUtils.getDateOfDays(endDate, 1);
			}
		}

		if (beginDate == null) {
			beginDate = ApiUtils.getWeekBeginDate();
		}

		if (endDate == null) {
			endDate = ApiUtils.getDateOfDays(beginDate, 7);
		}
		int code = 0;
		String msg = "成功！";
		String data = "[]";

		try {
			List<LeaderActivities> list = leaderActivitiesService.Weileader(
					schamal, ApiUtils.parseDateStr(beginDate),
					ApiUtils.parseDateStr(endDate), null);
			if (list != null && list.size() > 0) {
				// Type type = new TypeToken<List<LeaderActivities>>()
				// {}.getType();
				// Gson gson=new Gson();
				// data = gson.toJson(list, type);
				List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
				if (list != null && list.size() > 0) {
					for (LeaderActivities lead : list) {
						Map<String, Object> map = new HashMap<String, Object>();
						map.put("activeId", lead.getActiveId());
						map.put("activeName", lead.getActiveName());
						map.put("startTime",
								ApiUtils.parseDateTimeStr(lead.getStartTime()));
						map.put("endTime",
								ApiUtils.parseDateTimeStr(lead.getEndTime()));
						map.put("createUser", lead.getAppUser() != null ? lead
								.getAppUser().getFullname() : null);
						map.put("createDate",
								ApiUtils.parseDateTimeStr(lead.getCreateDate()));
						map.put("timeType", lead.getTimeType());
						map.put("timeNumber", lead.getTimeNumber());
						result.add(map);
					}
				}

				JSONArray jsonarray = JSONArray.fromObject(result);
				data = jsonarray.toString();
			}
		} catch (Exception e) {
			e.printStackTrace();
			logger.error("获取领导活动错误", e);
		}

		StringBuffer buff = new StringBuffer("{'code':" + code + ",'msg':"
				+ msg + ",'data':");
		buff.append(data);
		buff.append("}");
		jsonString = buff.toString();
		return SUCCESS;
	}

	public String queryUserInfo() {
		String username = getRequest().getParameter("username");
		String password = getRequest().getParameter("password");
		AppUser user = userService.findByUserNameNew(username);
		password = StringUtil.encryptSha256(password);
		StringBuffer buff = new StringBuffer();
		if (user != null && user.getPassword().equals(password)) {
			UserInfo userInfo = new UserInfo();
			userInfo.setDepId(user.getDepartment().getDepId());
			userInfo.setDepName(user.getDepartment().getDepName());
			userInfo.setUsername(user.getUsername());
			userInfo.setPassword(user.getPassword());
			userInfo.setFullName(user.getFullname());
			userInfo.setEmail(user.getEmail());
			userInfo.setPhone(user.getPhone());
			userInfo.setPosition(user.getPosition());
			JSONArray jsonarray = JSONArray.fromObject(userInfo);
			String data = jsonarray.toString();
			buff.append("{\"success\":true,\"data\":" + data + "}");
		} else {
			buff.append("{\"success\":false,\"data\":\"\"}");
		}
		jsonString = buff.toString();
		return SUCCESS;
	}

	public String queryDeptInfo() {
		List<Department> list = departmentService
				.findDepartmentBySchema("GHJOA");
		List<DeptInfo> deptList = new ArrayList<DeptInfo>();
		for (Department dept : list) {
			DeptInfo deptInfo = new DeptInfo();
			deptInfo.setDeptId(dept.getDepId());
			deptInfo.setDeptName(dept.getDepName());
			deptInfo.setParentId(dept.getParentId());
			deptList.add(deptInfo);
		}
		StringBuffer buff = new StringBuffer();
		JSONArray jsonarray = JSONArray.fromObject(deptList);
		String data = jsonarray.toString();
		buff.append("{'success':true,'data':" + data + "}");
		jsonString = buff.toString();
		return SUCCESS;
	}

	public String queryZFZDDeptInfo() {
		List<ZFZDDeptInfo> deptList = new ArrayList<ZFZDDeptInfo>();
		String[] schemas = new String[] { "ZFZDOA", "ZSZDOA", "G1ZOA", "G2ZOA",
				"G3ZOA", "G4ZOA", "G5ZOA" };
		for (int i = 0; i < schemas.length; i++) {
			List<Department> list = departmentService
					.findDepartmentBySchema(schemas[i]);
			for (Department dept : list) {
				ZFZDDeptInfo deptInfo = new ZFZDDeptInfo();
				deptInfo.setDeptId(dept.getDepId());
				deptInfo.setDeptName(dept.getDepName());
				deptInfo.setParentId(dept.getParentId());
				deptInfo.setDepUnitCode(dept.getDepUnitCode());
				deptInfo.setIsExternal(dept.getIsExternal());
				deptInfo.setDepLevel(dept.getDepLevel());
				deptInfo.setPath(dept.getPath());
				deptList.add(deptInfo);
			}
		}
		StringBuffer buff = new StringBuffer();
		JSONArray jsonarray = JSONArray.fromObject(deptList);
		String data = jsonarray.toString();
		buff.append("{\"success\":true,\"data\":" + data + "}");
		jsonString = buff.toString();
		return SUCCESS;
	}

	public String queryZFZDUserInfo() {
		List<ZFZDUserInfo> userList = new ArrayList<ZFZDUserInfo>();
		String[] schemas = new String[] { "ZFZDOA", "ZSZDOA", "G1ZOA", "G2ZOA",
				"G3ZOA", "G4ZOA", "G5ZOA" };
		for (int i = 0; i < schemas.length; i++) {
			List<AppUser> list = userService.findSchemaUser(schemas[i]);
			for (AppUser user : list) {
				ZFZDUserInfo userInfo = new ZFZDUserInfo();
				userInfo.setUsername(user.getUsername());
				userInfo.setIdNumber(user.getIdNumber());
				;
				userList.add(userInfo);
			}
		}
		StringBuffer buff = new StringBuffer();
		JSONArray jsonarray = JSONArray.fromObject(userList);
		String data = jsonarray.toString();
		buff.append("{\"success\":true,\"data\":" + data + "}");
		jsonString = buff.toString();
		return SUCCESS;
	}

	private String successResultValue;

	public String getSuccessResultValue() {
		return successResultValue;
	}

	public void setSuccessResultValue(String successResultValue) {
		this.successResultValue = successResultValue;
	}

	public String getWaitingUser() {
		String taskId = getRequest().getParameter("taskId");// 流程ID
		String userId = getRequest().getParameter("userIds");// 用户ID，一个或者多个
		String waitUser = "";
		if (StringUtils.isEmpty(taskId) || StringUtils.isEmpty(userId)) {
			return waitUser;
		}
		List<JbpmTask> tasks = null;
		try {
			tasks = processRunService.getProTasksByTaskId(Long.valueOf(taskId));
		} catch (Exception e) {

		}
		if (tasks == null || tasks.size() <= 0) {
			return waitUser;
		}
		for (JbpmTask task : tasks) {
			if (task != null
					&& StringUtils.isNotEmpty(userId)
					&& userId.indexOf(task.getAssignee()) >= 0
					&& !StringUtils.equals(String.valueOf(ContextUtil
							.getCurrentUser().getUserId()), task.getAssignee())) {
				waitUser += task.getAssigneeName() + "、";
			}
		}
		if (StringUtils.isNotEmpty(waitUser)) {
			waitUser = waitUser.substring(0, waitUser.length() - 1);
		}
		return waitUser;
	}

	public String getWaitingDept() {
		String taskId = getRequest().getParameter("taskId");// 流程ID
		String deptId = getRequest().getParameter("deptIds");// 用户ID，一个或者多个
		String waitDept = "";
		if (StringUtils.isEmpty(taskId) || StringUtils.isEmpty(deptId)) {
			return waitDept;
		}
		List<JbpmTask> tasks = null;
		try {
			tasks = processRunService.getProTasksByTaskId(Long.valueOf(taskId));
		} catch (Exception e) {

		}
		if (tasks == null || tasks.size() <= 0) {
			return waitDept;
		}
		List<Department> deptList = processRunService.getDeptByUserIds(deptId);
		if (deptList == null || deptList.size() <= 0) {
			return waitDept;
		}
		for (JbpmTask task : tasks) {
			for (Department dept : deptList) {
				if (task.getDepid().equals(dept.getDepId())
						&& waitDept.indexOf(dept.getDepName()) == -1) {
					waitDept += dept.getDepName() + "、";
				}
			}
		}
		if (StringUtils.isNotEmpty(waitDept)) {
			waitDept = waitDept.substring(0, waitDept.length() - 1);
		}
		return waitDept;
	}

	public String doTask() {
		Long taskId = parseLong("taskId");
		String activityName = getRequest().getParameter("activityName");
		// String ccUserIds = getRequest().getParameter("ccUserIds");
		Long runId = parseLong("runId");
		Long defId = parseLong("defId");
		Long userId = parseLong("userId");
		String schemaKey = getRequest().getParameter("schemaKey");
		String currentUserId = String.valueOf(userId);

		AppUser curUser = appUserService.findSchemaUserByUserId(schemaKey,
				userId);

		UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(
				curUser.getUsername(), curUser.getPassword());
		SecurityContext securityContext = SecurityContextHolder.getContext();
		securityContext.setAuthentication(authenticationManager
				.authenticate(authRequest));
		SecurityContextHolder.setContext(securityContext);
		getSession()
				.setAttribute(
						AuthenticationProcessingFilter.SPRING_SECURITY_LAST_USERNAME_KEY,
						curUser.getUsername());

		JbpmTask jbpmTask = processRunService.getByTaskId(taskId);
		if (jbpmTask == null) {
			setJsonString("{\"success\":\"false\", \"code\":\"3\", \"message\":\"该文件被撤回、流程编辑或已处理，请点击“确认”之后再操作！\"}");
			return SUCCESS;
		}
		if (!StringUtils.equals(jbpmTask.getAssignee(), currentUserId)) {
			setJsonString("{\"success\":\"false\", \"code\":\"3\", \"message\":\"该文件当前处理人已经变更，请点击“确认”之后再操作！\"}");
			return SUCCESS;
		}
		String instanceId = jbpmTask.getInstance();
		if (StringUtils.isNotEmpty(CurrentTaskHelper.get(taskId.toString()))) {
			setJsonString("{\"success\":\"false\", \"code\":\"2\", \"message\":\"该文件正在处理，请稍后\"}");
			return SUCCESS;
		}
		CurrentTaskHelper.put(taskId.toString(), currentUserId);
		CurrentTaskHelper.addProcessNum(instanceId, currentUserId);
		synchronized (SyncUtil.pool.intern(SyncUtil.SYNC_NEXT_PROCESS_FLAG
				+ instanceId)) {
			CustomerLog.customerLog(SyncUtil.customerLog, "开始处理流程（领导）------->"
					+ instanceId + "===" + taskId);
			try {
				String waitDept = getWaitingDept();
				if (StringUtils.isNotEmpty(waitDept)) {
					setJsonString("{\"success\":\"false\", \"code\":\"4\", \"message\":\""
							+ waitDept + "正在处理该文件\"}");
					CurrentTaskHelper.remove(taskId.toString());
					CurrentTaskHelper.reduceProcessNum(instanceId,
							currentUserId);
					return SUCCESS;
				}
				String waitUser = getWaitingUser();
				if (StringUtils.isNotEmpty(waitUser)) {
					setJsonString("{\"success\":\"false\", \"code\":\"4\", \"message\":\""
							+ waitUser + "正在处理该文件\"}");
					CurrentTaskHelper.remove(taskId.toString());
					CurrentTaskHelper.reduceProcessNum(instanceId,
							currentUserId);
					return SUCCESS;
				}
				// 完成当前任务
				ProcessRun processRun = processRunService.getByTaskId(taskId
						.toString());
				if (processRun == null) {
					setJsonString("{\"success\":\"false\", \"code\":\"3\", \"message\":\"该文件被撤回、流程编辑或已处理，请点击“确认”之后再操作！\"}");
					CurrentTaskHelper.remove(taskId.toString());
					CurrentTaskHelper.reduceProcessNum(instanceId,
							currentUserId);
					return SUCCESS;
				}

				FlowRunInfo flowRunInfo = getFlowRunInfo(activityName, runId,
						defId, taskId);
				ProcessFormReq processFormReq = getProcessFormReq();
				processFormReq.setCurUser(curUser);
				String piId = flowRunInfo.getPiId();
				ProcessInstance pi = processRunService.saveAndNextStep(
						flowRunInfo, processFormReq);
				if (null == pi) {
					notice(processRun);
				} else {
					notice(pi, "" + userId, piId, schemaKey);
				}
				setJsonString("{\"success\":\"true\", \"code\":\"1\", \"message\":\"操作成功\"}");
			} catch (Exception e) {
				CustomerLog.customerLog(SyncUtil.customerLog, e);
				setJsonString("{\"success\":\"false\", \"code\":\"0\", \"message\":\"操作出错，请联系管理员\"}");
			}
			CurrentTaskHelper.remove(taskId.toString());
			CurrentTaskHelper.reduceProcessNum(instanceId, currentUserId);
			CustomerLog.customerLog(SyncUtil.customerLog, "结束处理流程（领导）------->"
					+ instanceId + "===" + taskId);
		}
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
		String archivesId = getRequest().getParameter("archivesId");
		String leader = getRequest().getParameter("leader");
		String state = getRequest().getParameter("state");
		String schema = getRequest().getParameter("schemaKey");
		AppUser appUser = appUserService.findSchemaUserByUserId(schema, Long.parseLong(leader));
		
		UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(appUser.getUsername(), appUser.getPassword());
		SecurityContext securityContext = SecurityContextHolder.getContext();
		securityContext.setAuthentication(authenticationManager.authenticate(authRequest));
		SecurityContextHolder.setContext(securityContext);
        getSession().setAttribute(AuthenticationProcessingFilter.SPRING_SECURITY_LAST_USERNAME_KEY,appUser.getUsername());
		
		Archives archives = archivesService.get(Long.parseLong(archivesId));
		LeaderActivities leaderActivities = leaderActivitiesService.findByArchivesIdAndUserId(schema, archives.getArchivesId(), Long.parseLong(leader));
		if("1".equals(state)){
			if(leaderActivities != null){
				leaderActivities.setUpdateDate(new Date());
				leaderActivities.setUpdateUser(ContextUtil.getCurrentUser()
						.getFullname());
				leaderActivities.setActiveDesc(archives.getShortContent());
				leaderActivities.setActiveName(archives.getSubject());
				leaderActivities.setStartTime(archives.getLimitedDate());
			}else{
				leaderActivities = new LeaderActivities();
				leaderActivities.setActiveDesc(archives.getShortContent());
				leaderActivities.setActiveName(archives.getSubject());
				leaderActivities.setStartTime(archives.getLimitedDate());
				leaderActivities.setCreateDate(new Date());
				leaderActivities.setCreateUser(ContextUtil.getCurrentUser()
						.getFullname());
				leaderActivities.setTimeType(0);
				leaderActivities.setTimeNumber(1);
				AppUser leaderUser = appUserService.get(Long.parseLong(leader));
				leaderActivities.setAppUser(leaderUser);
				leaderActivities.setDataSources(1);
			}
			leaderActivities = leaderActivitiesService.save(leaderActivities);
			leaderActivitiesService.insertArchiveActive(schema, Long.parseLong(archivesId), leaderActivities.getActiveId());
		}else{
			if(leaderActivities != null){
				leaderActivitiesService.removeArchivesActive(schema,leaderActivities.getActiveId());
				leaderActivitiesService.remove(leaderActivities);
			}
		}
		setJsonString("{success:" + res + "}");
		return SUCCESS;
	}

	// 会议通知发送短信
	public void sendMsgForMeeting() {
		String userId = getRequest().getParameter("userId");
		String archivesId = getRequest().getParameter("archivesId");
		String content = getRequest().getParameter("content");
		String schemaKey = getRequest().getParameter("schemaKey");
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm");

		AppUser appUser = appUserService.findSchemaUserByUserId(schemaKey,
				Long.parseLong(userId));

		UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(
				appUser.getUsername(), appUser.getPassword());
		SecurityContext securityContext = SecurityContextHolder.getContext();
		securityContext.setAuthentication(authenticationManager
				.authenticate(authRequest));
		SecurityContextHolder.setContext(securityContext);
		getSession()
				.setAttribute(
						AuthenticationProcessingFilter.SPRING_SECURITY_LAST_USERNAME_KEY,
						appUser.getUsername());
		Archives archives = archivesService.get(Long.parseLong(archivesId));

		if (appUser.getMobile() != null) {
			if (content == null || "".equals(content.trim())) {
				content = "会议通知:您已确认参加由" + archives.getIssueDep() + "召集的"
						+ "\"" + archives.getSubject() + "\"" + "会议，请您于"
						+ dateFormat.format(archives.getLimitedDate())
						+ "准时参加。--系统自动发送";
			}else{
				content += "--系统自动发送";
			}
			System.out.println("content:" + content);
			smsMobileService.saveSms(String.valueOf(appUser.getUserId()),
					content);
		}
	}

	private void notice(ProcessInstance pi, String userId, String piId,
			String schemaKey) throws InterruptedException {
		if (pi != null) {
			List<Task> taskList = jbpmService.getTasksByPiId(pi.getId());
			System.out.println("notice    开始");
			for (Task task : taskList) {
				TaskImpl taskImpl = (TaskImpl) task;
				if (taskImpl.getSuperTask() == null
						&& taskImpl.getSubTasks().size() != 0) {
					for (Task taskTemp : taskImpl.getSubTasks()) {
						AppUser appUser = appUserService.get(Long
								.valueOf(taskTemp.getAssignee()));

						sendMailNotice(taskImpl, appUser, schemaKey);
					}

				}
				if (taskImpl.getAssignee() == null) {
					Iterator<ParticipationImpl> partIt = taskImpl
							.getAllParticipants().iterator();
					while (partIt.hasNext()) {
						ParticipationImpl part = partIt.next();
						if (part.getGroupId() != null
								&& StringUtil.isNum(part.getGroupId())) {
							List<AppUser> appUserList = appUserService.findByRoleId(new Long(part.getGroupId()));
							for (AppUser user : appUserList) {

								sendMailNotice(taskImpl, user, schemaKey);
							}
						} else if (part.getUserId() != null
								&& StringUtil.isNum(part.getUserId())) {
							AppUser appUser = appUserService.get(new Long(part
									.getUserId()));

							sendMailNotice(taskImpl, appUser, schemaKey);
						}
					}

				} else if (StringUtil.isNum(taskImpl.getAssignee())) {
					AppUser appUser = appUserService.get(new Long(taskImpl
							.getAssignee()));

					sendMailNotice(taskImpl, appUser, schemaKey);
				}
			}
			System.out.println("notice    结束");
		} else {
			if (StringUtils.isNotEmpty(userId) && StringUtils.isNotEmpty(piId)) {
				AppUser appUser = appUserService.get(Long.valueOf(userId));
				ProDefinition proDefinition = proDefinitionService.get(Long
						.valueOf(piId));
				sendNotice(proDefinition, appUser);
			}
		}
	}

	private Task task1;
	private AppUser appUsers;
	private String schemaKeys;
	private HttpServletRequest request;

	private void sendMailNotice(Task task, AppUser appUser, String schemaKey) {
		task1 = task;
		appUsers = appUser;
		schemaKeys = schemaKey;
		request = getRequest();
		AppUtil.interfaceSchema = schemaKeys;
		try {
			ExecutorService executor = Executors.newCachedThreadPool();
			Future<String> future = executor.submit(new Callable<String>() {
				@Override
				public String call() throws Exception {
					System.out.println("call");
					String sendMail = "true";
					String sendMsg = "true";
					String sendInfo = "true";
					Date curDate = new Date();
					SimpleDateFormat sdf = new SimpleDateFormat(
							"yyyy-MM-dd HH:mm");
					String curDateStr = sdf.format(curDate);
					String executionId = task1.getExecutionId();
					if (executionId.contains("MeetingRecord")
							&& executionId.indexOf("to") > 0) {
						executionId = executionId.substring(0,
								executionId.indexOf("to") - 1);
					}
					ProcessRun processRun = processRunService
							.getByPiId(executionId);
					Archives archives = archivesService
							.getArchivesByRunId(processRun.getRunId());
					if ("true".equals(sendMail)) {
						if (appUsers.getEmail() != null) {
							String tempPath = "mail/flowMail.vm";
							Map<String, Object> model = new HashMap<String, Object>();
							model.put("curDateStr", curDateStr);
							model.put("appUser", appUsers);
							model.put("task", task1);
							String subject = "OA待办提醒:"
									+ processRun.getSubject();
							model.put("subject", processRun.getSubject());
							mailEngine.sendTemplateMail(tempPath, model,
									subject, null,
									new String[] { appUsers.getEmail() }, null,
									null, null, null, true);
						}
					}
					if ("true".equals(sendMsg)) {
						if (appUsers.getMobile() != null) {
							String content = request.getParameter("noticeText");
							if (content == null || "".equals(content.trim())) {
								content = "待办提醒:OA系统于" + curDateStr
										+ "给您发送了一条待办事项：" + "\""
										+ processRun.getSubject() + "\""
										+ "，请您尽快处理。--系统自动发送";
							}
							System.out.println("content:" + content);
							smsMobileService.saveSms(
									String.valueOf(appUsers.getUserId()),
									content);
						}
					}
					if ("true".equals(sendInfo)) {
						Map<String, String> model = new HashMap<String, String>();
						model.put("title", "OA待办提醒:");
						model.put("toUser", appUsers.getUsername());
						model.put("contentInfo", "OA系统产生了一条您的待办事项：\""
								+ processRun.getSubject() + "\"，请您尽快处理。");
						model.put("sentDatetime", curDateStr);
						IMUtil.sendImMsg(velocityEngine, model);
					}
					Map<String, String> map = new HashMap<String, String>();
					map.put("deviceType", "3");
					map.put("token",
							"AjuHsQOMd4j9PwAW46GCQfZw41lmw4NW0G52hjT0KXQN");
					map.put("title", "ＯＡ待办提醒:");
					map.put("txt",
							"ＯＡ系统产生了一条您的待办事项：\"" + processRun.getSubject()
									+ "\"，请您尽快处理。");
					map.put("test", "3");
					map.put("taskId", task1.getId());
					map.put("msgType", ("0,1,2".indexOf(archives.getArchType()
							+ "")) != -1 ? "archives" : "meeting");
					map.put("runId", processRun.getRunId() + "");
					try {
						IMUtil.sendPush(map);
					} catch (UnsupportedEncodingException e) {
						e.printStackTrace();
					}
					SysMessage message = new SysMessage();
					message.setCreate_date(new Date());
					message.setOriginal_id(archives.getArchivesId());
					message.setOriginal_type(archives.getArchType());
					message.setRead_flag(0);
					message.setRunId(processRun.getRunId());
					message.setSubject(archives.getSubject());
					message.setTaskId(new Long(task1.getId()));
					message.setTo_user(appUsers.getUserId());
					messageService.save(message);
					return "true";
				}
			});
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			AppUtil.interfaceSchema = "";
		}
	}

	private Long parseLong(String key) {
		Long result = null;
		String s = getRequest().getParameter(key);
		if (StringUtils.isNotBlank(s)) {
			try {
				result = Long.parseLong(s);
			} catch (Exception e) {
			}
		}
		return result;
	}

	private void notice(ProcessRun processRun) {
		try {
			Thread.sleep(5000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		AppUser appUser = appUserService.get(processRun.getUserId());
		ProDefinition proDefinition = processRun.getProDefinition();
		sendNotice(proDefinition, appUser);
	}

	private void sendNotice(ProDefinition proDefinition, AppUser appUser) {
		String sendMail = getRequest().getParameter("sendMail");
		String sendMsg = getRequest().getParameter("sendMsg");
		Date curDate = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
		String curDateStr = sdf.format(curDate);
		String content = AppUtil.getCompanyName() + "办公管理系统于" + curDateStr
				+ "审核完成您发起的" + proDefinition.getName();
		if ("true".equals(sendMail)) {
			if (appUser.getEmail() != null) {
				if (logger.isDebugEnabled()) {
					logger.info("Notice " + appUser.getFullname() + " by mail:"
							+ appUser.getEmail());
				}

				String tempPath = "mail/mailNotice.vm";
				Map<String, Object> model = new HashMap<String, Object>();
				model.put("curDateStr", curDateStr);
				model.put("defName", proDefinition.getName());
				String subject = "来自" + AppUtil.getCompanyName() + "办公系统的待办任务("
						+ proDefinition.getName() + ")提醒";
				mailEngine.sendTemplateMail(tempPath, model, subject, null,
						new String[] { appUser.getEmail() }, null, null, null,
						null, true);

			}
		}
		if ("true".equals(sendMsg)) {
			if (appUser.getMobile() != null) {
				smsMobileService.saveSms(String.valueOf(appUser.getUserId()),
						content);
			}
		}
		if ("true".equals(getRequest().getParameter("sendInfo"))) {
			Map<String, String> model = new HashMap<String, String>();
			model.put("title", "OA提醒:");
			model.put("toUser", appUser.getUsername());
			model.put("contentInfo", content);
			model.put("sentDatetime", curDateStr);
			IMUtil.sendImMsg(velocityEngine, model);
		}

	}

	protected FlowRunInfo getFlowRunInfo(String activityName, Long runId,
			Long defId, Long taskId) {
		FlowRunInfo info = new FlowRunInfo(getRequest());
		Map<String, ParamField> fieldMap = constructFieldMap(activityName,
				runId, defId, taskId);
		info.setParamFields(fieldMap);
		return info;
	}

	protected ProDefinition getProDefinition(Long runId, Long defId, Long taskId) {
		ProDefinition proDefinition = null;
		if (runId != null) {
			ProcessRun processRun = processRunService.get(runId);
			proDefinition = processRun.getProDefinition();
		} else if (defId != null) {
			proDefinition = proDefinitionService.get(defId);
		} else {// if(piId!=null){
			ProcessRun processRun = processRunService.getByTaskId(taskId
					.toString());
			proDefinition = processRun.getProDefinition();
		}
		return proDefinition;
	}

	protected Map<String, ParamField> constructFieldMap(String activityName,
			Long runId, Long defId, Long taskId) {
		HttpServletRequest request = getRequest();
		ProDefinition proDefinition = getProDefinition(runId, defId, taskId);
		if (StringUtils.isEmpty(activityName)) {
			activityName = jbpmService.getStartNodeName(proDefinition);
		}
		Map<String, ParamField> map = ProcessActivityAssistant
				.constructFieldMap(proDefinition.getName(), activityName);

		Iterator<String> fieldNames = map.keySet().iterator();
		while (fieldNames.hasNext()) {
			String name = fieldNames.next();
			ParamField pf = map.get(name);
			pf.setName(pf.getName().replace(".", "_"));
			// if(pf.getLabel()!=null&&!pf.getLabel().equals("")){
			// pf.setValue(request.getParameter(pf.getLabel()));
			// }else{
			pf.setValue(request.getParameter(name));
			// }
		}
		return map;
	}

	protected ProcessFormReq getProcessFormReq() {
		ProcessFormReq info = new ProcessFormReq(getRequest());
		return info;
	}

	public void downLoad() throws Exception {
		boolean isOnLine = false;
		String uploadPath = getRequest().getSession().getServletContext()
				.getRealPath("/attachFiles/"); // 上传文件的目录
		SysArchivesFilesService sysArchivesFilesService = (SysArchivesFilesService) AppUtil
				.getBean("sysArchivesFilesService");
		SysArchivesFilesHisService sysArchivesFilesHisService = (SysArchivesFilesHisService) AppUtil
				.getBean("sysArchivesFilesHisService");
		String schemaKey = getRequest().getParameter("schemaKey");
		String fileId = getRequest().getParameter("fileId");
		String id = getRequest().getParameter("id");
		String hisId = getRequest().getParameter("hisId");
		String fPath = null;
		String filePath = null;
		AppUtil.interfaceSchema = schemaKey;
		try {
			if (null != fileId && "" != fileId) {
				FileAttach fileAttach = fileAttachService.get(new Long(fileId));
				fPath = uploadPath + "/" + fileAttach.getFilePath();
				filePath = fPath;
			} else if (null != id && "" != id) {
				SysArchivesFiles sysArchivesFiles = sysArchivesFilesService
						.get(new Long(id));
				fPath = uploadPath + "/" + sysArchivesFiles.getFilePath();
				filePath = fPath;
			}else if (null != hisId && "" != hisId) {
				SysArchivesFilesHis sysArchivesFilesHis = sysArchivesFilesHisService
						.get(new Long(hisId));
				fPath = uploadPath + "/" + sysArchivesFilesHis.getFilePath();
				filePath = fPath;
			}

			File f = new File(filePath);
			HttpServletResponse response = getResponse();
			if (!f.exists()) {
				response.sendError(404, "File not found!");
				return;
			}
			BufferedInputStream br = new BufferedInputStream(
					new FileInputStream(f));
			byte[] buf = new byte[1024];
			int len = 0;

			response.reset(); // 非常重要
			if (isOnLine) { // 在线打开方式
				URL u = new URL("file:///" + filePath);
				response.setContentType(u.openConnection().getContentType());
				response.setHeader("Content-Disposition", "inline; filename="
						+ f.getName());
				// 文件名应该编码成UTF-8
			} else { // 纯下载方式
				response.setContentType("application/x-msdownload");
				response.setHeader("Content-Disposition",
						"attachment; filename=" + f.getName());
			}
			OutputStream out = response.getOutputStream();
			while ((len = br.read(buf)) > 0)
				out.write(buf, 0, len);
			br.close();
			out.close();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			AppUtil.interfaceSchema = "";
		}
	}
	public String resetSchema(){
		AppUtil.interfaceSchema = "OA";
		try {
			Thread.sleep(5000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			AppUtil.interfaceSchema = "";
		}
		return "success";
	}
}
