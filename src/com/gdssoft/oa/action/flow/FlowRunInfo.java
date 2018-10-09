package com.gdssoft.oa.action.flow;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;

import com.gdssoft.core.Constants;
import com.gdssoft.core.jbpm.pv.ParamField;

/**
 * 流程启动或运行携带的相关信息
 * 
 * @author csx
 */
public class FlowRunInfo {
	/**
	 * 携带流程运行的变量
	 */
	private Map variables = new HashMap();

	/**
	 * 用于存储流程任务表单中的数据
	 */
	private Map<String, ParamField> paramFields = new HashMap<String, ParamField>();

	/**
	 * 是否启动流程
	 */
	private boolean isStartFlow = false;

	/**
	 * 当前流程运行的信息
	 */
	private HttpServletRequest request;

	/**
	 * 流程的名称
	 */
	private String processName = "通用";

	/**
	 * 当前任务名称
	 * 
	 */
	private String activityName = "开始";

	/**
	 * 目标节点名称
	 */
	private String destName = null;

	/**
	 * 流程跳转的路径名称
	 */
	private String transitionName;

	/**
	 * Jbpm流程的TaskId
	 */
	private String taskId;

	/**
	 * 流程实列ID
	 */
	private String piId;
	/**
	 * 流程发起人ID
	 */
	private String userId;

	/**
	 * 
	 */
	public FlowRunInfo(HttpServletRequest req) {
		// 是否启动流程
		if ("true".equals(req.getParameter("startFlow"))) {
			isStartFlow = true;
		}
		// 下一任务是否为会签任务,一般在定制的任务中使用
		String signUserIds = req.getParameter(Constants.FLOW_SIGN_USERIDS);
		if (StringUtils.isNotEmpty(signUserIds)) {
			variables.put(Constants.FLOW_SIGN_USERIDS, signUserIds);
		}

		String flowAssignId = req.getParameter(Constants.FLOW_ASSIGN_ID);
		if (StringUtils.isNotEmpty(flowAssignId)) {
			variables.put(Constants.FLOW_ASSIGN_ID, flowAssignId);
		}

		String forkUserIds = req.getParameter(Constants.FLOW_FORK_USERIDS);
		if (StringUtils.isNotEmpty(forkUserIds)) {
			variables.put(Constants.FLOW_FORK_USERIDS, forkUserIds);
		}
		// 合并节点名称
		String pJoinName = req.getParameter(Constants.JOIN_NAME);
		if (StringUtils.isNotEmpty(pJoinName)) {
			variables.put(Constants.JOIN_NAME, pJoinName);
		}
		// 合并后节点名称
		String pJoinedName = req.getParameter(Constants.JOINED_NAME);
		if (StringUtils.isNotEmpty(pJoinedName)) {
			variables.put(Constants.JOINED_NAME, pJoinedName);
		}
		// 会签任务上一步名称
		String prevName = req.getParameter(Constants.PREV_NAME);
		if (StringUtils.isNotEmpty(prevName)) {
			variables.put(Constants.PREV_NAME, prevName);
		}
		// 并发流程定义
		String pIsForkFlow = req.getParameter(Constants.IS_FORK_FLOW);
		if (StringUtils.isNotEmpty(pIsForkFlow)) {
			variables.put(Constants.IS_FORK_FLOW, pIsForkFlow);
		}
		// 并发流程中会签任务定义
		String pIsJoinFlow = req.getParameter(Constants.IS_JOIN_FLOW);
		if (StringUtils.isNotEmpty(pIsJoinFlow)) {
			variables.put(Constants.IS_JOIN_FLOW, pIsJoinFlow);
		}
		// 结束流程定义
		String pIsEndFlow = req.getParameter(Constants.IS_END_FLOW);
		if (StringUtils.isNotEmpty(pIsEndFlow)) {
			variables.put(Constants.IS_END_FLOW, pIsEndFlow);
		}
		String signUserId = req.getParameter("userId");
		if (StringUtils.isNotEmpty(signUserId)) {
			userId = signUserId;
		}

		// 在任务中有使用taskId
		String pTaskId = req.getParameter("taskId");
		if (StringUtils.isNotEmpty(pTaskId)) {
			taskId = pTaskId;
		}

		// 流程实例ID
		String pPiId = req.getParameter("piId");

		if (StringUtils.isNotEmpty(pPiId)) {
			piId = pPiId;
		}

		// 当前任务或活动的名称
		String pActivityName = req.getParameter("activityName");
		if (StringUtils.isNotEmpty(pActivityName)) {
			activityName = pActivityName;
		}

		String pTaskName = req.getParameter("taskName");
		if (StringUtils.isNotEmpty(pTaskName)) {
			activityName = pTaskName;
		}

		// 目标节点名称
		String pDestName = req.getParameter("destName");

		if (StringUtils.isNotEmpty(pDestName)) {
			destName = pDestName;
		}

		// 当前跳转的名称
		String pSignName = req.getParameter("signalName");
		if (StringUtils.isNotEmpty(pSignName)) {
			transitionName = pSignName;
		}

	}

	public FlowRunInfo() {

	}

	public Map getVariables() {
		return variables;
	}

	public void setVariables(Map variables) {
		this.variables = variables;
	}

	public boolean isStartFlow() {
		return isStartFlow;
	}

	public void setStartFlow(boolean isStartFlow) {
		this.isStartFlow = isStartFlow;
	}

	public HttpServletRequest getRequest() {
		return request;
	}

	public void setRequest(HttpServletRequest request) {
		this.request = request;
	}

	public String getProcessName() {
		return processName;
	}

	public void setProcessName(String processName) {
		this.processName = processName;
	}

	public String getActivityName() {
		return activityName;
	}

	public void setActivityName(String activityName) {
		this.activityName = activityName;
	}

	public Map<String, ParamField> getParamFields() {
		return paramFields;
	}

	public void setParamFields(Map<String, ParamField> paramFields) {
		this.paramFields = paramFields;
	}

	public String getTransitionName() {
		return transitionName;
	}

	public void setTransitionName(String transitionName) {
		this.transitionName = transitionName;
	}

	public String getTaskId() {
		return taskId;
	}

	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	public String getPiId() {
		return piId;
	}

	public void setPiId(String piId) {
		this.piId = piId;
	}

	public String getDestName() {
		return destName;
	}

	public void setDestName(String destName) {
		this.destName = destName;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	/**
	 * 添加启动后，任务的执行人员
	 * 
	 * @param assignId
	 */
	public void setdAssignId(String assignId) {
		variables.put(Constants.FLOW_ASSIGN_ID, assignId);
	}

	/**
	 * 添加启动流程后，设置该任务，使得
	 * 
	 * @param userIds
	 */
	public void setMultipleTask(String userIds) {
		variables.put(Constants.FLOW_SIGN_USERIDS, userIds);
	}

}
