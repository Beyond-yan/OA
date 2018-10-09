package com.gdssoft.oa.point;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;
import javax.jws.WebService;

import org.apache.commons.lang.StringUtils;
import org.apache.velocity.app.VelocityEngine;
import org.jbpm.api.ProcessInstance;
import org.jbpm.api.task.Task;
//import org.jbpm.pvm.internal.model.Transition;
import org.jbpm.api.model.Transition;
import org.jbpm.pvm.internal.task.ParticipationImpl;
import org.jbpm.pvm.internal.task.TaskImpl;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.engine.MailEngine;
import com.gdssoft.core.jbpm.jpdl.Node;
import com.gdssoft.core.jbpm.pv.ParamField;
import com.gdssoft.core.util.AppUtil;
import com.gdssoft.core.util.StringUtil;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.action.flow.ProcessActivityAssistant;
import com.gdssoft.oa.dao.flow.ProcessFormDao;
import com.gdssoft.oa.dao.flow.ProcessRunDao;
import com.gdssoft.oa.model.communicate.SmsMobile;
import com.gdssoft.oa.model.flow.CcuserProcess;
import com.gdssoft.oa.model.flow.FormData;
import com.gdssoft.oa.model.flow.ProDefinition;
import com.gdssoft.oa.model.flow.ProcessForm;
import com.gdssoft.oa.model.flow.ProcessRun;
import com.gdssoft.oa.model.jw.JwArchives;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.communicate.SmsMobileService;
import com.gdssoft.oa.service.flow.CcuserProcessService;
import com.gdssoft.oa.service.flow.JbpmService;
import com.gdssoft.oa.service.flow.ProDefinitionService;
import com.gdssoft.oa.service.flow.ProcessFormService;
import com.gdssoft.oa.service.flow.ProcessRunService;
import com.gdssoft.oa.service.flow.TaskAgentService;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.oa.util.IMUtil;
import com.google.gson.Gson;

@WebService(endpointInterface = "com.gdssoft.oa.point.ActiivityService", targetNamespace = "http://point.oa.gdssoft.com/")
public class ActiivityServiceImpl implements ActiivityService {
	@Resource
	private ProDefinitionService proDefinitionService;
	@Resource
	private ProcessRunService processRunService;
	@Resource
	private AppUserService appUserService;
	@Resource
	private JbpmService jbpmService;
	@Resource
	private VelocityEngine velocityEngine;
	@Resource
	private MailEngine mailEngine;
	@Resource
	private SmsMobileService smsMobileService;
	@Resource
	CcuserProcessService ccuserProcessService;
	@Resource
	private TaskAgentService taskAgentService;
	@Resource
	private ProcessRunDao dao;
	@Resource
	private ProcessFormDao processFormDao;
	private ProcessRun processRun;
	@Resource
	private ProcessFormService processFormService;
	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");

	/**
	 * 下一步
	 * 
	 * @return
	 */
	@Override
	public String getnext(Long taskId, String ccUserIds, String sendMail,
			String sendMsg, String sendInfo, String activityName,
			String status, String comments, String isBack, boolean isStartFlow,
			String userId, String piId, String taskName, String destName,
			String signalName, Long CurrentUser, String signUserIds,
			String formParamters) {
		AppUtil.interfaceSchema = "oa";
		String[] strValues = null;
		Map<String, String> mapValue = new HashMap<String, String>();
		if (null != formParamters && !formParamters.equals("")) {
			strValues = formParamters.split(";");
			for (int i = 0; i < strValues.length; i++) {
				String value = strValues[i];
				if (!StringUtils.isBlank(value)) {
					String[] parameters = value.split(":");
					mapValue.put(parameters[0], parameters[1]);
				}
			}
		}
		String result = "";
		try {
			AppUser curUser = appUserService.findSchemaUserByUserId("oa",
					CurrentUser);
			String userid = userId.toString();
			// 完成当前任务
			List<Transition> trans = jbpmService.getTransitionsByTaskId(taskId
					.toString());
			Transition tran = trans.get(0);
			if (null != tran && signalName.equals(""))
				signalName = tran.getName();
			System.out.print(signalName);
			ProcessRun processRun = processRunService.getByTaskId(taskId
					.toString());
			FlowRunInfo flowRunInfo = getFlowRunInfo(processRun.getRunId(),
					processRun.getProDefinition().getDefId(), taskId,
					activityName, isStartFlow, userId, piId, taskName,
					destName, signalName, signUserIds, mapValue);
			ProcessFormReq processFormReq = getProcessFormReq(status, comments,
					isBack);
			ProcessInstance pi = NextStep(flowRunInfo, processFormReq, curUser);
			if (null == pi) {
				notice(processRun, sendMail, sendMsg, sendInfo);
			} else {
				// 通知相关的处理人员
				notice(pi, userid, piId, sendMail, sendMsg, sendInfo);
			}
			// 抄送人员
			if (ccUserIds != null && ccUserIds.trim().length() != 0) {
				String[] ccUserId = ccUserIds.split(",");
				// 删除所有
				ccuserProcessService.delete(processRun.getRunId());
				// 新增人员
				for (int i = 0; i < ccUserId.length; i++) {
					CcuserProcess ccuserProcess = new CcuserProcess();
					ccuserProcess.setCcUserId(Long.parseLong(ccUserId[i]));
					ccuserProcess.setProcessRunId(processRun.getRunId());
					ccuserProcess.setCreateUserId(CurrentUser);
					ccuserProcessService.save(ccuserProcess);
				}
			}
			taskAgentService.delTaskGrants(Long.valueOf(taskId));
			result = "{\"errorFlag\": \"0\",\"data\":\"操作成功！\"}";
		} catch (Exception e) {
			result = "{\"errorFlag\": \"1\",\"data\":\"操作出错，请联系管理员！\"}";
		} finally {
			AppUtil.interfaceSchema = "";
		}
		return result;
	}

	/**
	 * 取得流程运行的相关信息
	 */

	protected FlowRunInfo getFlowRunInfo(Long runId, Long defId, Long taskId,
			String activityName, boolean isStartFlow, String userId,
			String piId, String taskName, String destName, String signalName,
			String signUserIds, Map<String, String> mapValue) {
		FlowRunInfo info = new FlowRunInfo();
		String taskid = taskId.toString();
		info.setActivityName(activityName);
		info.setDestName(destName);
		info.setPiId(piId);
		info.setTaskId(taskid);
		info.setStartFlow(isStartFlow);
		info.setUserId(userId);
		// info.setFlowAssignId(flowAssignId);
		info.setTransitionName(signalName);
		info.setFlowAssignId(userId);
		info.setSignUserIds(signUserIds);
		Map<String, ParamField> fieldMap = constructFieldMap(runId, defId,
				taskId, activityName, mapValue);
		info.setParamFields(fieldMap);
		return info;
	}

	/**
	 * 取得流程运行的相关信息
	 */
	protected ProcessFormReq getProcessFormReq(String status, String comments,
			String isBack) {
		ProcessFormReq info = new ProcessFormReq();
		info.setComments(comments);
		info.setIsBack(isBack);
		info.setStatus(status);
		return info;
	}

	/**
	 * 构建提交的流程或任务对应的表单信息字段
	 * 
	 * @return
	 */
	protected Map<String, ParamField> constructFieldMap(Long runId, Long defId,
			Long taskId, String activityName, Map<String, String> mapValue) {
		ProDefinition proDefinition = getProDefinition(runId, defId, taskId);
		// 取得开始节点的任务名称
		if (StringUtils.isEmpty(activityName)) {
			activityName = jbpmService.getStartNodeName(proDefinition);
		}
		// 取得开始任务节点
		Map<String, ParamField> map = ProcessActivityAssistant
				.constructFieldMap(proDefinition.getName(), activityName);

		Iterator<String> fieldNames = map.keySet().iterator();
		while (fieldNames.hasNext()) {
			String name = fieldNames.next();
			ParamField pf = map.get(name);
			// 防止在Vm中通过.取不到值的问题，替换为_，如在提交表单时，
			// 名称为arch.docName，在VM中取值将会变成arch_docName
			pf.setName(pf.getName().replace(".", "_"));
			if (mapValue.get(name) != null) {
				pf.setValue(mapValue.get(name));
			}
			map.put(name, pf);
		}
		return map;
	}

	private void notice(ProcessInstance pi, String userId, String piId,
			String sendMail, String sendMsg, String sendInfo) {
		// 取得这些任务的下一步的相关参与人员，并且根据页面提交的设置决定是否发送短信及邮件
		if (pi != null) {
			List<Task> taskList = jbpmService.getTasksByPiId(pi.getId());

			for (Task task : taskList) {
				TaskImpl taskImpl = (TaskImpl) task;
				// 会签发送短信
				if (taskImpl.getSuperTask() == null
						&& taskImpl.getSubTasks().size() != 0) {
					for (Task taskTemp : taskImpl.getSubTasks()) {
						AppUser appUser = appUserService.get(Long
								.valueOf(taskTemp.getAssignee()));
						sendMailNotice(taskImpl, appUser, sendMail, sendMsg,
								sendInfo);
					}

				}
				if (taskImpl.getAssignee() == null) {
					Iterator<ParticipationImpl> partIt = taskImpl
							.getAllParticipants().iterator();
					while (partIt.hasNext()) {
						ParticipationImpl part = partIt.next();
						if (part.getGroupId() != null
								&& StringUtil.isNum(part.getGroupId())) {
							// 发送邮件
							List<AppUser> appUserList = appUserService
									.findByRoleId(new Long(part.getGroupId()));
							for (AppUser user : appUserList) {
								sendMailNotice(taskImpl, user, sendMail,
										sendMsg, sendInfo);
							}
						} else if (part.getUserId() != null
								&& StringUtil.isNum(part.getUserId())) {
							AppUser appUser = appUserService.get(new Long(part
									.getUserId()));
							sendMailNotice(taskImpl, appUser, sendMail,
									sendMsg, sendInfo);
						}
					}

				} else if (StringUtil.isNum(taskImpl.getAssignee())) {
					// 有签核人的
					System.out.println("有签核人的" + taskImpl.getAssignee());
					AppUser appUser = appUserService.get(new Long(taskImpl
							.getAssignee()));
					sendMailNotice(taskImpl, appUser, sendMail, sendMsg,
							sendInfo);
				}
			}
		} else {
			if (StringUtils.isNotEmpty(userId) && StringUtils.isNotEmpty(piId)) {
				AppUser appUser = appUserService.get(Long.valueOf(userId));
				ProDefinition proDefinition = proDefinitionService.get(Long
						.valueOf(piId));
				sendNotice(proDefinition, appUser, sendMail, sendMsg, sendInfo);
			}
		}
	}

	/**
	 * 发送邮件及短信通知
	 * 
	 * @param task
	 * @param appUser
	 */
	private void sendMailNotice(Task task, AppUser appUser, String sendMail,
			String sendMsg, String sendInfo) {
		Date curDate = new Date();
		String curDateStr = sdf.format(curDate);
		String executionId = task.getExecutionId();
		if (executionId.contains("MeetingRecord")
				&& executionId.indexOf("to") > 0) {
			executionId = executionId.substring(0,
					executionId.indexOf("to") - 1);
		}
		ProcessRun processRun = processRunService.getByPiId(executionId);

		if ("true".equals(sendMail)) { // 发送邮件
			if (appUser.getEmail() != null) {
				String tempPath = "mail/flowMail.vm";
				Map model = new HashMap();
				model.put("curDateStr", curDateStr);
				model.put("appUser", appUser);
				model.put("task", task);
				String subject = "ＯＡ待办提醒:" + processRun.getSubject();
				model.put("subject", processRun.getSubject());
				mailEngine.sendTemplateMail(tempPath, model, subject, null,
						new String[] { appUser.getEmail() }, null, null, null,
						null, true);
			}
		}
		if ("true".equals(sendMsg)) { // 发送手机短信
			if (appUser.getMobile() != null) {
				String content = "待办提醒:ＯＡ系统于" + curDateStr + "给您发送了一条待办事项："
						+ "\"" + processRun.getSubject() + "\""
						+ "，请您尽快处理。--系统自动发送";
				System.out.println("content:" + content);
				smsMobileService.saveSms(String.valueOf(appUser.getUserId()),
						content);
			}
		}

		if ("true".equals(sendInfo)) {
			Map<String, String> model = new HashMap<String, String>();
			model.put("title", "ＯＡ待办提醒:");
			model.put("toUser", appUser.getUsername());
			model.put("contentInfo",
					"ＯＡ系统产生了一条您的待办事项：\"" + processRun.getSubject()
							+ "\"，请您尽快处理。");
			model.put("sentDatetime", curDateStr);
			IMUtil.sendImMsg(velocityEngine, model);
		}
	}

	/**
	 * 
	 * 流程最后一步发送邮件和短信通知
	 * 
	 * @param task
	 * @param appUser
	 */
	private void sendNotice(ProDefinition proDefinition, AppUser appUser,
			String sendMail, String sendMsg, String sendInfo) {
		Date curDate = new Date();
		String curDateStr = sdf.format(curDate);
		String content = AppUtil.getCompanyName() + "办公管理系统于" + curDateStr
				+ "审核完成您发起的" + proDefinition.getName();
		System.out.println("---content---" + content);

		if ("true".equals(sendMail)) {
			// 发送邮件
			if (appUser.getEmail() != null) {
				System.out.print("Notice " + appUser.getFullname()
						+ " by mail:" + appUser.getEmail());
				String tempPath = "mail/mailNotice.vm";
				Map model = new HashMap();
				model.put("curDateStr", curDateStr);
				model.put("defName", proDefinition.getName());
				String subject = "来自" + AppUtil.getCompanyName() + "办公系统的待办任务("
						+ proDefinition.getName() + ")提醒";
				System.out.println("---subject---" + subject);
				mailEngine.sendTemplateMail(tempPath, model, subject, null,
						new String[] { appUser.getEmail() }, null, null, null,
						null, true);

			}
		}
		if ("true".equals(sendMsg)) {
			// 发送手机短信
			if (appUser.getMobile() != null) {
				System.out.print("Notice " + appUser.getFullname()
						+ " by mobile:" + appUser.getMobile());
				smsMobileService.saveSms(String.valueOf(appUser.getUserId()),
						content);
			}
		}

		if ("true".equals(sendInfo)) {
			Map<String, String> model = new HashMap<String, String>();
			model.put("title", "ＯＡ提醒:");
			model.put("toUser", appUser.getUsername());
			model.put("contentInfo", content);
			model.put("sentDatetime", curDateStr);
			IMUtil.sendImMsg(velocityEngine, model);
		}
	}

	/**
	 * 借宿流程时发送短信
	 * 
	 * @author F3222507
	 * @param processRun
	 */
	private void notice(ProcessRun processRun, String sendMail, String sendMsg,
			String sendInfo) {
		System.out.println("notice:ProcessRun");
		// 睡眠防止短信和邮件标题未更新
		try {
			Thread.sleep(5000);
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		// 取得这些任务的下一步的相关参与人员，并且根据页面提交的设置决定是否发送短信及邮件
		AppUser appUser = appUserService.get(processRun.getUserId());
		ProDefinition proDefinition = processRun.getProDefinition();
		sendNotice(proDefinition, appUser, sendMail, sendMsg, sendInfo);
	}

	/**
	 * 取得流程定义
	 * 
	 * @return
	 */
	protected ProDefinition getProDefinition(Long runId, Long defId, Long taskId) {
		ProDefinition proDefinition = null;
		/*
		 * if (runId != null) { ProcessRun processRun =
		 * processRunService.get(runId); proDefinition =
		 * processRun.getProDefinition(); } else
		 *//*
			 * if (defId != null) { proDefinition =
			 * proDefinitionService.get(defId); } else {
			 */// if(piId!=null){
		ProcessRun processRun = processRunService
				.getByTaskId(taskId.toString());
		proDefinition = processRun.getProDefinition();
		/* } */
		return proDefinition;
	}

	/**
	 * 完成任务，同时把数据保存至form_data表，记录该任务填写的表单数据
	 * 
	 * @param piId
	 * @param transitionName
	 * @param variables
	 */
	public ProcessInstance NextStep(FlowRunInfo runInfo,
			ProcessFormReq processFormReq, AppUser curUser) {
		Boolean freeJump = false;
		if (processFormReq.getIsBack() != null
				&& "true".equals(processFormReq.getIsBack())) {
			freeJump = true;
		}
		ProcessInstance pi;
		if (StringUtils.isNotEmpty(runInfo.getTaskId())) {
			pi = jbpmService.getProcessInstanceByTaskId(runInfo.getTaskId());
		} else {
			pi = jbpmService.getProcessInstance(runInfo.getPiId());
		}

		String xml = jbpmService.getDefinitionXmlByPiId(pi.getId());

		String nodeType = jbpmService.getNodeType(xml,
				runInfo.getActivityName());

		ProcessRun processRun = getByPiId(pi.getId());

		// 取得最大的sn号，也则某一任务被重复驳回时，可以由此查看
		Integer maxSn = processFormDao.getActvityExeTimes(
				processRun.getRunId(), runInfo.getActivityName()).intValue();
		ProcessForm processForm = new ProcessForm();
		if (processFormReq.getComments() != null) {
			if (processFormReq.getComments().indexOf("退回") != -1
					|| processFormReq.toString().indexOf("撤回") != -1
					|| processFormReq.getComments().indexOf("流程编辑") != -1) {
				processForm.setActivityName(processFormReq.getComments());
				processForm.setType(new Long(1));
			} else {
				processForm.setActivityName(runInfo.getActivityName());
				processForm.setType(new Long(0));
			}
		} else if (processFormReq.getStatus() != null) {
			if (processFormReq.getStatus().indexOf("退回") != -1
					|| processFormReq.getStatus().indexOf("撤回") != -1
					|| processFormReq.getStatus().indexOf("流程编辑") != -1) {
				processForm.setActivityName(processFormReq.getStatus());
				processForm.setType(new Long(1));
			} else {
				processForm.setActivityName(runInfo.getActivityName());
				processForm.setType(new Long(0));
			}
		} else {
			processForm.setActivityName(runInfo.getActivityName());
			processForm.setType(new Long(0));
		}
		processForm.setSn(maxSn + 1);
		System.out.println("processFormReq.getStatus()"
				+ processFormReq.getStatus());
		System.out.println("processFormReq.getComments()"
				+ processFormReq.getComments());
		processForm.setStatus(processFormReq.getStatus());
		processForm.setComments(processFormReq.getComments());

		// 设置执行人ID及人名，方便后面查询参与用户
		processForm.setCreatorId(curUser.getUserId());
		processForm.setCreatorName(curUser.getFullname());

		processForm.setProcessRun(processRun);
		// 保存这些数据至流程运行的环境中
		Map<String, Object> variables = runInfo.getVariables();
		if (freeJump) {
			variables.put("freeJumpUserId", curUser.getUserId());
		}
		Iterator it = runInfo.getParamFields().keySet().iterator();

		while (it.hasNext()) {
			String key = (String) it.next();
			ParamField paramField = runInfo.getParamFields().get(key);
			FormData fd = new FormData(paramField);
			fd.setProcessForm(processForm);
			// 把数据存储在variables
			variables.put(key, fd.getValue());
			processForm.getFormDatas().add(fd);
		}
		ProcessForm processForm2=processFormService.save(processForm);
		// 保存数据至表单中，方便后面显示
		// processFormDao.save(processForm);

		// 设置当前任务为完成状态，并且为下一任务设置新的执行人或候选人
		if ("task".equals(nodeType)) {
			// 完成此任务，同时为下一任务指定执行人
			return jbpmService.completeTask(runInfo.getTaskId(),
					runInfo.getTransitionName(), runInfo.getDestName(),
					runInfo.getVariables(), freeJump,processForm2.getFormId());
		} else {// 普通节点
			jbpmService.signalProcess(pi.getId(), runInfo.getTransitionName(),
					variables);
			return pi;
		}
	}

	public ProcessRun getByPiId(String piId) {
		return dao.getByPiId(piId);
	}

	/**
	 * 终止一个流程
	 * 
	 * @author F3222507
	 * @return
	 */
	@Override
	public String getStop(String piId) {
		String result = "";
		AppUtil.interfaceSchema = "oa";
		try {
			System.out.println("--piId--" + piId);
			jbpmService.endProcessInstance(piId);
			ProcessRun processRun = processRunService.getByPiId(piId);
			processRun.setPiId(null);
			processRun.setRunStatus(ProcessRun.RUN_STATUS_STOPED);
			processRunService.stopProcessRun(processRun);
			result = "{\"errorFlag\": \"0\",\"data\":\"操作成功！\"}";
		} catch (Exception e) {
			result = "{\"errorFlag\": \"1\",\"data\":\"操作出错，请联系管理员！\"}";
		} finally {
			AppUtil.interfaceSchema = "";
		}
		System.out.print(AppUtil.interfaceSchema);
		return result;
	}

	/**
	 * 获取上一步操作
	 */
	@Override
	public String getPreviousStep(String taskId) {
		String result = "";
		AppUtil.interfaceSchema = "oa";
		StringBuffer sb = new StringBuffer();
		if (StringUtils.isBlank(taskId)) {
			result = "{success:false,data:'taskId is null!'}";
			return result;
		}
		// 获取流程信息
		try {
			ProcessInstance pis = jbpmService
					.getProcessInstanceByTaskId(taskId);
			processRun = processRunService.getByPiId(pis.getId());
			// getRequest().setAttribute("processRun", processRun);
			Long runId = processRun.getRunId();
			String start = "0";
			String limit = "100";
			// 获取审批列表
			QueryFilter filter = new QueryFilter();
			PagingBean pageBean = new PagingBean(0, 100);
			filter.setPagingBean(pageBean);
			filter.getPagingBean().setPageSize(100000);
			filter.addFilter("Q_processRun.runId_L_EQ", runId.toString());
			filter.addFilter("Q_type_L_EQ", "0");
			filter.addSorted("formId", "ASC");
			List<ProcessForm> pfList = processFormService.getAll(filter);
			// List<ProcessForm> pfList=processFormService.getByRunId(runId);
			if (pfList.size() < 1) {
				sb = new StringBuffer(
						"{success:false,data:'no previous step!'}");
				result = sb.toString();
				return result;
			}
			// 获取最后一次签核信息，会签不适用
			ProcessForm processForm = pfList.get(pfList.size() - 1);
			sb.append("{errorFlag:0,data:[{activityName:'");
			sb.append(processForm.getActivityName() + "',");
			sb.append("creatorId:'" + processForm.getCreatorId() + "',");
			sb.append("status:'" + processForm.getStatus() + "',");
			// sb.append("comments:'" + processForm.getComments() + "',");
			sb.append("signalName:'to" + processForm.getActivityName() + "',");
			sb.append("processRunId:'" + processForm.getProcessRun().getRunId()
					+ "'");
			sb.append("}]}");
			result = sb.toString();
		} catch (Exception e) {
			result = "{\"errorFlag\": \"1\",\"data\":\"操作出错，请联系管理员！\"}";
		} finally {
			AppUtil.interfaceSchema = "";
		}
		return result;
	}

	/**
	 * 获取审批信息
	 */
	@Override
	public String getprocessRunDetail(Long taskId, Long runId) {
		AppUtil.interfaceSchema = "oa";
		String result = "";
		ProcessRun processRun = null;
		if (runId == null) {
			ProcessInstance pis = jbpmService.getProcessInstanceByTaskId(taskId
					.toString());
			processRun = processRunService.getByPiId(pis.getId());
			/* getRequest().setAttribute("processRun", processRun); */
			runId = processRun.getRunId();
		} else {
			processRun = processRunService.get(runId);
		}
		try {
			List<ProcessForm> pfList = processFormService.getByRunId(runId);
			StringBuffer buff = new StringBuffer("{\"errorFlag\": 0,\"data\":[");
			for (ProcessForm ProcessForm : pfList) {
				buff.append("{\"count\":\"").append(pfList.size())
						.append("\",\"formId\":\"")
						.append(ProcessForm.getFormId())
						.append("\",\"activityName\":\"")
						.append(ProcessForm.getActivityName())
						.append("\",\"creatorName\":\"")
						.append(ProcessForm.getCreatorName())
						.append("\",\"createtime\":\"")
						.append(ProcessForm.getCreatetime())
						.append("\",\"comments\":\"")
						.append(ProcessForm.getComments()).append("\"}");
				buff.append(",");
			}
			String piId = processRun.getPiId();
			if (piId != null && !"".equals(piId)) {
				List<Task> tasks = jbpmService.getTasksByPiId(piId);
				String userId = null;
				StringBuilder sb = new StringBuilder();
				if (tasks != null) {
					for (Task task : tasks) {
						userId = task.getAssignee();
						if (userId != null) {
							AppUser appUser = appUserService.get(Long
									.valueOf(userId));
							sb.append(appUser.getFullname()).append(",");
						}
						Set<Task> suTasks = ((TaskImpl) task).getSubTasks();
						System.out.println("suTasks:" + suTasks);
						if (userId == null && suTasks.size() != 0) {
							for (Task t : suTasks) {
								userId = t.getAssignee();
								AppUser appUser = appUserService.get(Long
										.valueOf(userId));
								sb.append(appUser.getFullname()).append(",");
							}

						}
						if (userId == null && suTasks.size() == 0) {
							sb.append("该任务还没有人锁定").append(",");
						}

					}
				}
				// 存放下一步审批人
				String s = sb.toString().substring(0,
						sb.toString().length() - 1);
				/* getRequest().setAttribute("s", s); */
			} else {

				/* getRequest().setAttribute("s", "流程已结束"); */

			}

			// 存放流程审批列表
			/* getRequest().setAttribute("pfList", pfList); */
			buff.deleteCharAt(buff.length() - 1);// 删除最后一个","字符
			buff.append("]}");
			result = buff.toString();
		} catch (Exception e) {
			result = "{\"errorFlag\": \"1\",\"data\":\"操作出错，请联系管理员！\"}";
		} finally {
			AppUtil.interfaceSchema = "";
		}
		return result;
	}

	@Override
	public String saveSms(Long userId, String userIds, String content) {
		AppUtil.interfaceSchema = "oa";
		String result = "";
		try {
			AppUser user = appUserService.get(userId);
			// 号码序列,用","分隔
			System.out.println("userIds1:" + userIds);
			if (StringUtils.isNotEmpty(userIds)) {
				String[] ids = userIds.split(",");
				for (String id : ids) {
					AppUser recipients = appUserService.get(new Long(id));

					SmsMobile smsMobile = new SmsMobile();
					smsMobile.setPhoneNumber(recipients.getMobile());
					smsMobile.setSendTime(new Date());
					smsMobile.setRecipients(recipients.getFullname());
					smsMobile.setRecipientsId(recipients);
					smsMobile.setSmsContent(content);
					smsMobile.setUserId(user.getUserId());
					smsMobile.setUserName(user.getUsername());
					smsMobile.setStatus(SmsMobile.STATUS_NOT_SENDED);
					System.out.println("recipients.getMobile:"
							+ recipients.getMobile());
					smsMobileService.save(smsMobile);
					result = "{\"errorFlag\": \"0\",\"data\":\"操作成功！\"}";
				}
			}
		} catch (Exception e) {
			result = "{\"errorFlag\": \"1\",\"data\":\"操作出错，请联系管理员！\"}";
		} finally {
			AppUtil.interfaceSchema = "";
		}
		return result;
	}
	/**
	 * 流程定义的任务节点
	 * 
	 * @return
	 */
	@Override
	public String flowDefTasks(Long runId) {
		AppUtil.interfaceSchema = "oa";
		String result = "";
		try {
		ProcessRun processRun=processRunService.get(runId);
		Gson gson = new Gson();
		StringBuffer buff = new StringBuffer("{\"errorFlag\": 0,\"data\":[");
		List<Node> nodes = jbpmService.getTaskNodesByDefId(processRun.getProDefinition().getDefId());
		for (Node node : nodes) {
			buff.append("{\"taskname\":\"").append(node.getName()).append("\"}");
	         buff.append(",");
		}
		buff.deleteCharAt(buff.length() - 1);// 删除最后一个","字符
		buff.append("]}");
		result = buff.toString();
		}
		
		catch (Exception e) {
			result = "{\"errorFlag\": \"1\",\"data\":\"操作出错，请联系管理员！\"}";
		} finally {
			AppUtil.interfaceSchema = "";
		}
		return result;
	
	}
	@Override
	public JwArchives getarchive(JwArchives jwArchives) {
		return jwArchives;
	}
	}
