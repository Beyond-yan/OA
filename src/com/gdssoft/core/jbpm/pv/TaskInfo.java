package com.gdssoft.core.jbpm.pv;
/*
 *  广州宏天软件有限公司 OA办公自动管理系统   -- http://www.jee-soft.cn
 *  Copyright (C) 2008-2009 GuangZhou HongTian Software Company
*/
import java.util.Date;
import org.jbpm.pvm.internal.task.TaskImpl;

public class TaskInfo {
	//用于显示任务名称，一般会包括流程名称在前
	private String taskName;
	//活动名称
	private String activityName;
	private String assignee;
	private Date createTime;
	private Date dueDate;
	private String executionId;
	private String pdId;
	private Long taskId;
	private int type;
	private String link;
	private String urgentLevel;
	private String daiBanInfo;
	private String creatorName;
	private String depName;
	private Short archivesType;
	
	public Short getArchivesType() {
		return archivesType;
	}

	public void setArchivesType(Short archivesType) {
		this.archivesType = archivesType;
	}

	/**
	 * 任务是否可由多人来执行，默认为0,则表示该任务只能由特定的人来执行。
	 */
	private Short isMultipleTask=0;
	
	//候选人员
	private String candidateUsers="";//taskImpl.getParticipations();
	//候选角色
	private String candidateRoles="";
	
	public TaskInfo() {
	}
	
	public TaskInfo(TaskImpl taskImpl){
		this.taskName=taskImpl.getActivityName();
		
		this.activityName=taskImpl.getActivityName();
		this.assignee=taskImpl.getAssignee();
		this.dueDate=taskImpl.getDuedate();
		this.createTime=taskImpl.getCreateTime();
		if(taskImpl.getSuperTask()!=null){
			this.pdId=taskImpl.getSuperTask().getProcessInstance().getId();
			this.executionId=taskImpl.getSuperTask().getExecutionId();
		}else{
			this.pdId=taskImpl.getProcessInstance().getId();
			this.executionId=taskImpl.getExecutionId();
		}
		
		this.taskId=taskImpl.getDbid();
		
		if(taskImpl.getParticipations().size()>0){//可由其他人来执行
			isMultipleTask=1;
		}
	}

	public String getActivityName() {
		return activityName;
	}

	public void setActivityName(String activityName) {
		this.activityName = activityName;
	}

	public String getAssignee() {
		return assignee;
	}

	public void setAssignee(String assignee) {
		this.assignee = assignee;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public Date getDueDate() {
		return dueDate;
	}

	public void setDueDate(Date dueDate) {
		this.dueDate = dueDate;
	}

	public String getExecutionId() {
		return executionId;
	}

	public void setExecutionId(String executionId) {
		this.executionId = executionId;
	}

	public String getCandidateUsers() {
		return candidateUsers;
	}

	public void setCandidateUsers(String candidateUsers) {
		this.candidateUsers = candidateUsers;
	}

	public String getCandidateRoles() {
		return candidateRoles;
	}

	public void setCandidateRoles(String candidateRoles) {
		this.candidateRoles = candidateRoles;
	}

	public Long getTaskId() {
		return taskId;
	}

	public void setTaskId(Long taskId) {
		this.taskId = taskId;
	}

	public Short getIsMultipleTask() {
		return isMultipleTask;
	}

	public void setIsMultipleTask(Short isMultipleTask) {
		this.isMultipleTask = isMultipleTask;
	}

	public String getPdId() {
		return pdId;
	}

	public void setPdId(String pdId) {
		this.pdId = pdId;
	}

	public String getTaskName() {
		return taskName;
	}

	public void setTaskName(String taskName) {
		this.taskName = taskName;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public String getLink() {
		return link;
	}

	public void setLink(String link) {
		this.link = link;
	}

	public String getUrgentLevel() {
		return urgentLevel;
	}

	public void setUrgentLevel(String urgentLevel) {
		this.urgentLevel = urgentLevel;
	}

	public String getDaiBanInfo() {
		return daiBanInfo;
	}

	public void setDaiBanInfo(String daiBanInfo) {
		this.daiBanInfo = daiBanInfo;
	}

	public String getCreatorName() {
		return creatorName;
	}

	public void setCreatorName(String creatorName) {
		this.creatorName = creatorName;
	}

	public String getDepName() {
		return depName;
	}

	public void setDepName(String depName) {
		this.depName = depName;
	}
	
}
