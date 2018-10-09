package com.gdssoft.oa.model.meetingNotice;

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
public class MeetingNoticeToDo extends com.gdssoft.core.model.BaseModel {

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
	
	protected Long noticeId;
	protected String subject;
	protected String host;
	protected Date meetingDate;
	protected String meetingPlace;
	protected String holdDep;
	
	protected Long curDepId;
	protected String curDepName;
	
	
	protected Integer totalCounts;
	protected Integer imStatus;
	protected String preActivityname;
	protected String preDepName;
	protected String preUserName;
	protected String creator;
	protected String createDep;
	protected Integer isEnd;
	protected Long preUserId;
	protected Long preDepId;
	
	public String getCreator() {
		return creator;
	}
	public void setCreator(String creator) {
		this.creator = creator;
	}
	public String getCreateDep() {
		return createDep;
	}
	public void setCreateDep(String createDep) {
		this.createDep = createDep;
	}
	public String getPreActivityname() {
		return preActivityname;
	}
	public void setPreActivityname(String preActivityname) {
		this.preActivityname = preActivityname;
	}
	public String getPreDepName() {
		return preDepName;
	}
	public void setPreDepName(String preDepName) {
		this.preDepName = preDepName;
	}
	public String getPreUserName() {
		return preUserName;
	}
	public void setPreUserName(String preUserName) {
		this.preUserName = preUserName;
	}
	public Integer getIsEnd() {
		return isEnd;
	}
	public void setIsEnd(Integer isEnd) {
		this.isEnd = isEnd;
	}
	public Long getPreUserId() {
		return preUserId;
	}
	public void setPreUserId(Long preUserId) {
		this.preUserId = preUserId;
	}
	public Long getPreDepId() {
		return preDepId;
	}
	public void setPreDepId(Long preDepId) {
		this.preDepId = preDepId;
	}
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
	public String getHoldDep() {
		return holdDep;
	}
	public void setHoldDep(String holdDep) {
		this.holdDep = holdDep;
	}
	public Long getNoticeId() {
		return noticeId;
	}
	public void setNoticeId(Long noticeId) {
		this.noticeId = noticeId;
	}
	public String getSubject() {
		return subject;
	}
	public void setSubject(String subject) {
		this.subject = subject;
	}
	public Date getMeetingDate() {
		return meetingDate;
	}
	public void setMeetingDate(Date meetingDate) {
		this.meetingDate = meetingDate;
	}
	public String getMeetingPlace() {
		return meetingPlace;
	}
	public void setMeetingPlace(String meetingPlace) {
		this.meetingPlace = meetingPlace;
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
