package com.gdssoft.oa.point;

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
	private String signUserIds;
	private String flowAssignId;
	/**
	 * 
	 */

	public FlowRunInfo() {

	}

	public String getSignUserIds() {
		return signUserIds;
	}

	public void setSignUserIds(String signUserIds) {
		this.signUserIds = signUserIds;
	}

	public String getFlowAssignId() {
		return flowAssignId;
	}

	public void setFlowAssignId(String flowAssignId) {
		this.flowAssignId = flowAssignId;
	}

	public Map getVariables() {
		if(!StringUtils.isBlank(signUserIds)&&StringUtils.isBlank(flowAssignId))
		variables.put(Constants.FLOW_SIGN_USERIDS, signUserIds);
		if(!StringUtils.isBlank(flowAssignId))
		variables.put(Constants.FLOW_ASSIGN_ID, flowAssignId);
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
