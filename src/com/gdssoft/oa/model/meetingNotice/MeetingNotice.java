package com.gdssoft.oa.model.meetingNotice;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;

import com.gdssoft.oa.model.flow.ProcessRun;
import com.gdssoft.oa.model.meeting.OutMeeting;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.FileAttach;
import com.google.gson.annotations.Expose;

/**
 * Archives Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 */
public class MeetingNotice extends com.gdssoft.core.model.BaseModel {
    @Expose
	protected Long noticeId;
    @Expose
	protected String subject;//会议名称
    @Expose
	protected String host;//主持人
    @Expose
	protected String holdDep;//召集单位
    @Expose
	protected Date meetingDate;//会议时间
    @Expose
	protected String meetingPlace;//会议地点
    @Expose
	protected String meetingState;//会议状态
    @Expose
	protected Long reviewUser;
    @Expose
    protected Date departureTime;//出发时间
    @Expose
    protected String departurePlace;//出发地点
    @Expose
    protected String vehicleInfo;//车辆信息
    @Expose
    protected String driverInfo;//驾驶员信息
    @Expose
    protected String mainDep;//主办处室
    @Expose
    protected Long mainDepId;//主办处室Id
    @Expose
    protected Short status;//流程状态
    @Expose
    protected Date createTime;//创建时间
    @Expose 
    protected String creator;//创建人姓名
    @Expose 
    protected Long creatorId;//创建人ID
    @Expose 
    protected String createDep;//创建部门
    @Expose 
    protected Long createDepId;//创建部门ID
    @Expose
	protected Long runId;//流程ID
    @Expose 
    protected String attendLeaders;//参会领导
    @Expose 
    protected String attendLeadersName;//参会领导名称
    @Expose 
    protected String attendPersons;//参会人员
    @Expose 
    protected String attendPersonsName;//参会人员姓名

	protected java.util.Set<FileAttach> docs = new java.util.HashSet<FileAttach>();

	public Long getNoticeId() {
		return noticeId;
	}

	public void setNoticeId(Long noticeId) {
		this.noticeId = noticeId;
	}

	public String getAttendLeaders() {
		return attendLeaders;
	}

	public void setAttendLeaders(String attendLeaders) {
		this.attendLeaders = attendLeaders;
	}

	public String getAttendLeadersName() {
		return attendLeadersName;
	}

	public void setAttendLeadersName(String attendLeadersName) {
		this.attendLeadersName = attendLeadersName;
	}

	public String getAttendPersons() {
		return attendPersons;
	}

	public void setAttendPersons(String attendPersons) {
		this.attendPersons = attendPersons;
	}

	public String getAttendPersonsName() {
		return attendPersonsName;
	}

	public void setAttendPersonsName(String attendPersonsName) {
		this.attendPersonsName = attendPersonsName;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public String getHoldDep() {
		return holdDep;
	}

	public void setHoldDep(String holdDep) {
		this.holdDep = holdDep;
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

	public String getMeetingState() {
		return meetingState;
	}

	public void setMeetingState(String meetingState) {
		this.meetingState = meetingState;
	}

	public Long getReviewUser() {
		return reviewUser;
	}

	public void setReviewUser(Long reviewUser) {
		this.reviewUser = reviewUser;
	}

	public Date getDepartureTime() {
		return departureTime;
	}

	public void setDepartureTime(Date departureTime) {
		this.departureTime = departureTime;
	}

	public String getDeparturePlace() {
		return departurePlace;
	}

	public void setDeparturePlace(String departurePlace) {
		this.departurePlace = departurePlace;
	}

	public String getVehicleInfo() {
		return vehicleInfo;
	}

	public void setVehicleInfo(String vehicleInfo) {
		this.vehicleInfo = vehicleInfo;
	}

	public String getDriverInfo() {
		return driverInfo;
	}

	public void setDriverInfo(String driverInfo) {
		this.driverInfo = driverInfo;
	}

	public String getMainDep() {
		return mainDep;
	}

	public void setMainDep(String mainDep) {
		this.mainDep = mainDep;
	}

	public Long getMainDepId() {
		return mainDepId;
	}

	public void setMainDepId(Long mainDepId) {
		this.mainDepId = mainDepId;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public String getCreator() {
		return creator;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

	public Long getCreatorId() {
		return creatorId;
	}

	public void setCreatorId(Long creatorId) {
		this.creatorId = creatorId;
	}

	public Long getRunId() {
		return runId;
	}

	public void setRunId(Long runId) {
		this.runId = runId;
	}

	public String getCreateDep() {
		return createDep;
	}

	public void setCreateDep(String createDep) {
		this.createDep = createDep;
	}

	public Long getCreateDepId() {
		return createDepId;
	}

	public void setCreateDepId(Long createDepId) {
		this.createDepId = createDepId;
	}

	public java.util.Set<FileAttach> getDocs() {
		return docs;
	}

	public void setDocs(java.util.Set<FileAttach> docs) {
		this.docs = docs;
	}

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof MeetingNotice)) {
			return false;
		}
		MeetingNotice rhs = (MeetingNotice) object;
		return new EqualsBuilder()
				.append(this.noticeId, rhs.noticeId)
				.append(this.subject, rhs.subject)
				.append(this.host, rhs.host)
				.append(this.holdDep, rhs.holdDep)
				.append(this.meetingDate, rhs.meetingDate)
				.append(this.meetingPlace, rhs.meetingPlace)
				.append(this.meetingState, rhs.meetingState)
				.append(this.reviewUser, rhs.reviewUser)
				.append(this.departureTime, rhs.departureTime)
				.append(this.departurePlace, rhs.departurePlace)
				.append(this.vehicleInfo, rhs.vehicleInfo)
				.append(this.driverInfo, rhs.driverInfo)
				.append(this.mainDep, rhs.mainDep)
				.append(this.mainDepId, rhs.mainDepId)
				.append(this.status, rhs.status)
				.append(this.createTime, rhs.createTime)
				.append(this.creator, rhs.creator)
				.append(this.creatorId, rhs.creatorId)
				.append(this.runId, rhs.runId)
				.isEquals();
	}
	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.noticeId) 
				.append(this.subject) 
				.append(this.host) 
				.append(this.holdDep) 
				.append(this.meetingDate) 
				.append(this.meetingPlace) 
				.append(this.meetingState) 
				.append(this.reviewUser) 
				.append(this.departureTime) 
				.append(this.departurePlace) 
				.append(this.vehicleInfo)
				.append(this.driverInfo)
				.append(this.mainDep) 
				.append(this.mainDepId) 
				.append(this.status) 
				.append(this.createTime) 
				.append(this.creator) 
				.append(this.creatorId) 
				.append(this.runId) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("noticeId", this.noticeId) 
				.append("subject", this.subject) 
				.append("host", this.host) 
				.append("holdDep", this.holdDep) 
				.append("meetingDate", this.meetingDate) 
				.append("meetingPlace", this.meetingPlace) 
				.append("meetingState", this.meetingState) 
				.append("reviewUser", this.reviewUser) 
				.append("departureTime", this.departureTime) 
				.append("departurePlace", this.departurePlace) 
				.append("vehicleInfo",this.vehicleInfo)
				.append("driverInfo",this.driverInfo)
				.append("mainDep", this.mainDep) 
				.append("mainDepId", this.mainDepId) 
				.append("status", this.status) 
				.append("createtime", this.createTime) 
				.append("createUserName", this.creator) 
				.append("createUserId", this.creatorId) 
				.append("runId", this.runId)
				.toString();
	}
}
