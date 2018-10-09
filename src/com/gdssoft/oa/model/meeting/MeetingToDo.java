package com.gdssoft.oa.model.meeting;

import java.util.Date;

import com.gdssoft.oa.util.IMUtil;

/**
 * OutMeeting Base Java Bean; base class for the.oa.model; mapped directly to
 * database table
 * 
 * Avoid changing this file if not necessary; will be overwritten.
 * 
 * 
 */
public class MeetingToDo extends com.gdssoft.core.model.BaseModel {

	protected Long taskId;
	protected String taskName;
	protected String activityName;
	protected String flowName;
	
	protected Long defId;
	protected Long runId;
	protected String runSubject;
	protected Integer runStatus;
	protected String piid;
	protected Long assignUserId;
	protected String assignUserName;
	protected String assignUn;
	
	protected Long meetingId;
	protected String meetingName;
	protected String host;
	protected Date holdTime;
	protected String holdLocation;
	protected String holdDep;
	protected String attendLeaders;
	protected String attendOfficers;
	
	protected Long curDepId;
	protected String curDepName;
	
	
	protected Integer totalCounts;
	protected Integer imStatus;
	
	public Integer getRunStatus() {
		return runStatus;
	}
	public void setRunStatus(Integer runStatus) {
		this.runStatus = runStatus;
	}
	public Integer getImStatus() {
		return imStatus;
	}
	public void setImStatus(Integer imStatus) {
		this.imStatus = imStatus;
	}
	public Integer getTotalCounts() {
		return totalCounts;
	}
	public void setTotalCounts(Integer totalCounts) {
		this.totalCounts = totalCounts;
	}
	public Long getDefId() {
		return defId;
	}
	public void setDefId(Long defId) {
		this.defId = defId;
	}
	public Long getRunId() {
		return runId;
	}
	public void setRunId(Long runId) {
		this.runId = runId;
	}
	public Long getTaskId() {
		return taskId;
	}
	public void setTaskId(Long taskId) {
		this.taskId = taskId;
	}
	public String getTaskName() {
		return taskName;
	}
	public void setTaskName(String taskName) {
		this.taskName = taskName;
	}
	public String getActivityName() {
		return activityName;
	}
	public void setActivityName(String activityName) {
		this.activityName = activityName;
	}
	public String getRunSubject() {
		return runSubject;
	}
	public void setRunSubject(String runSubject) {
		this.runSubject = runSubject;
	}
	public Long getAssignUserId() {
		return assignUserId;
	}
	public void setAssignUserId(Long assignUserId) {
		this.assignUserId = assignUserId;
	}
	public String getAssignUserName() {
		return assignUserName;
	}
	public void setAssignUserName(String assignUserName) {
		this.assignUserName = assignUserName;
	}
	public Long getMeetingId() {
		return meetingId;
	}
	public void setMeetingId(Long meetingId) {
		this.meetingId = meetingId;
	}
	public String getMeetingName() {
		return meetingName;
	}
	public void setMeetingName(String meetingName) {
		this.meetingName = meetingName;
	}
	public Date getHoldTime() {
		return holdTime;
	}
	public void setHoldTime(Date holdTime) {
		this.holdTime = holdTime;
	}
	public String getHoldLocation() {
		return holdLocation;
	}
	public void setHoldLocation(String holdLocation) {
		this.holdLocation = holdLocation;
	}
	public String getHoldDep() {
		return holdDep;
	}
	public void setHoldDep(String holdDep) {
		this.holdDep = holdDep;
	}
	
	public String getAttendLeaders() {
		return attendLeaders;
	}
	public void setAttendLeaders(String attendLeaders) {
		this.attendLeaders = attendLeaders;
	}
	public String getAttendOfficers() {
		return attendOfficers;
	}
	public void setAttendOfficers(String attendOfficers) {
		this.attendOfficers = attendOfficers;
	}
	public Long getCurDepId() {
		return curDepId;
	}
	public void setCurDepId(Long curDepId) {
		this.curDepId = curDepId;
	}
	public String getCurDepName() {
		return curDepName;
	}
	public void setCurDepName(String curDepName) {
		this.curDepName = curDepName;
	}
	public String getFlowName() {
		return flowName;
	}
	public void setFlowName(String flowName) {
		this.flowName = flowName;
	}
	public String getPiid() {
		return piid;
	}
	public void setPiid(String piid) {
		this.piid = piid;
	}
	public String getHost() {
		return host;
	}
	public void setHost(String host) {
		this.host = host;
	}
	public String getAssignUn() {
		return assignUn;
	}
	public void setAssignUn(String assignUn) {
		this.assignUn = assignUn;
		this.setImStatus(IMUtil.getStatus(assignUn));
	}
}
