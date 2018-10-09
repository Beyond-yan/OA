package com.gdssoft.oa.model.integration;

public class FlowAuditLogModel {
	
	private String userId;
	private String loginId;
	private String flowStatus;//流程状态 0未开始的流程，1代办中、2结束，3撤销
	private String oaUserName;
	private String userName;
	private String deptName;
	private String flowRelateId;//集成流程ID
	
	private String approvalName;//审批步骤名称
	private String approvalTime;//审批时间
	private String approvalState;//状态
	private String approvalApinion;//意见
	
	public String getFlowStatus() {
		return flowStatus;
	}
	public void setFlowStatus(String flowStatus) {
		this.flowStatus = flowStatus;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getLoginId() {
		return loginId;
	}
	public void setLoginId(String loginId) {
		this.loginId = loginId;
	}
	
	public String getOaUserName() {
		return oaUserName;
	}
	public void setOaUserName(String oaUserName) {
		this.oaUserName = oaUserName;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getDeptName() {
		return deptName;
	}
	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}
	public String getFlowRelateId() {
		return flowRelateId;
	}
	public void setFlowRelateId(String flowRelateId) {
		this.flowRelateId = flowRelateId;
	}
	public String getApprovalName() {
		return approvalName;
	}
	public void setApprovalName(String approvalName) {
		this.approvalName = approvalName;
	}
	public String getApprovalTime() {
		return approvalTime;
	}
	public void setApprovalTime(String approvalTime) {
		this.approvalTime = approvalTime;
	}
	public String getApprovalState() {
		return approvalState;
	}
	public void setApprovalState(String approvalState) {
		this.approvalState = approvalState;
	}
	public String getApprovalApinion() {
		return approvalApinion;
	}
	public void setApprovalApinion(String approvalApinion) {
		this.approvalApinion = approvalApinion;
	}
	
}
