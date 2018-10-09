package com.gdssoft.oa.model.task;

/*
 *   捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
 */

import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

import com.google.gson.annotations.Expose;

/**
 * Appointment Base Java Bean, base class for the.oa.model, mapped directly to
 * database table
 * 
 * Avoid changing this file if not necessary, will be overwritten.
 * 
 * @update YHZ 2010-9-16 下午
 *         添加isMsg,isMobile两个字段,对方法：toString(),hashCode(),equals()进行修改
 * 
 */
@SuppressWarnings("serial")
public class Appointment extends com.gdssoft.core.model.BaseModel {

	@Expose
	protected Long appointId;
	@Expose
	protected String subject;
	@Expose
	protected java.util.Date startTime;
	@Expose
	protected java.util.Date endTime;
	@Expose
	protected String content;
	@Expose
	protected String notes;
	@Expose
	protected String location;
	@Expose
	protected String inviteEmails;
	@Expose
	protected com.gdssoft.oa.model.system.AppUser appUser;
	// 新加字段
	@Expose
	protected Integer isMsg;
	@Expose
	protected Integer isMobile;

	public Integer getIsMsg() {
		return isMsg;
	}

	public void setIsMsg(Integer isMsg) {
		this.isMsg = isMsg;
	}

	public Integer getIsMobile() {
		return isMobile;
	}

	public void setIsMobile(Integer isMobile) {
		this.isMobile = isMobile;
	}

	/**
	 * Default Empty Constructor for class Appointment
	 */
	public Appointment() {
		super();
	}

	/**
	 * Default Key Fields Constructor for class Appointment
	 */
	public Appointment(Long in_appointId) {
		this.setAppointId(in_appointId);
	}

	public com.gdssoft.oa.model.system.AppUser getAppUser() {
		return appUser;
	}

	public void setAppUser(com.gdssoft.oa.model.system.AppUser in_appUser) {
		this.appUser = in_appUser;
	}

	/**
	 * * @return Long
	 * 
	 * @hibernate.id column="appointId" type="java.lang.Long"
	 *               generator-class="native"
	 */
	public Long getAppointId() {
		return this.appointId;
	}

	/**
	 * Set the appointId
	 */
	public void setAppointId(Long aValue) {
		this.appointId = aValue;
	}

	/**
	 * 主键 * @return Long
	 */
	public Long getUserId() {
		return this.getAppUser() == null ? null : this.getAppUser().getUserId();
	}

	/**
	 * Set the userId
	 */
	public void setUserId(Long aValue) {
		if (aValue == null) {
			appUser = null;
		} else if (appUser == null) {
			appUser = new com.gdssoft.oa.model.system.AppUser(aValue);
			appUser.setVersion(new Integer(0));// set a version to cheat
			// hibernate only
		} else {
			appUser.setUserId(aValue);
		}
	}

	/**
	 * 主题 * @return String
	 * 
	 * @hibernate.property column="subject" type="java.lang.String" length="128"
	 *                     not-null="true" unique="false"
	 */
	public String getSubject() {
		return this.subject;
	}

	/**
	 * Set the subject
	 * 
	 * @spring.validator type="required"
	 */
	public void setSubject(String aValue) {
		this.subject = aValue;
	}

	/**
	 * 开始时间 * @return java.util.Date
	 * 
	 * @hibernate.property column="startTime" type="java.util.Date" length="19"
	 *                     not-null="true" unique="false"
	 */
	public java.util.Date getStartTime() {
		return this.startTime;
	}

	/**
	 * Set the startTime
	 * 
	 * @spring.validator type="required"
	 */
	public void setStartTime(java.util.Date aValue) {
		this.startTime = aValue;
	}

	/**
	 * 结束时间 * @return java.util.Date
	 * 
	 * @hibernate.property column="endTime" type="java.util.Date" length="19"
	 *                     not-null="true" unique="false"
	 */
	public java.util.Date getEndTime() {
		return this.endTime;
	}

	/**
	 * Set the endTime
	 * 
	 * @spring.validator type="required"
	 */
	public void setEndTime(java.util.Date aValue) {
		this.endTime = aValue;
	}

	/**
	 * 约会内容 * @return String
	 * 
	 * @hibernate.property column="content" type="java.lang.String"
	 *                     length="5000" not-null="true" unique="false"
	 */
	public String getContent() {
		return this.content;
	}

	/**
	 * Set the content
	 * 
	 * @spring.validator type="required"
	 */
	public void setContent(String aValue) {
		this.content = aValue;
	}

	/**
	 * 备注 * @return String
	 * 
	 * @hibernate.property column="notes" type="java.lang.String" length="1000"
	 *                     not-null="false" unique="false"
	 */
	public String getNotes() {
		return this.notes;
	}

	/**
	 * Set the notes
	 */
	public void setNotes(String aValue) {
		this.notes = aValue;
	}

	/**
	 * 地点 * @return String
	 * 
	 * @hibernate.property column="location" type="java.lang.String"
	 *                     length="150" not-null="true" unique="false"
	 */
	public String getLocation() {
		return this.location;
	}

	/**
	 * Set the location
	 * 
	 * @spring.validator type="required"
	 */
	public void setLocation(String aValue) {
		this.location = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="inviteEmails" type="java.lang.String"
	 *                     length="1000" not-null="false" unique="false"
	 */
	public String getInviteEmails() {
		return this.inviteEmails;
	}

	/**
	 * Set the inviteEmails
	 */
	public void setInviteEmails(String aValue) {
		this.inviteEmails = aValue;
	}

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof Appointment)) {
			return false;
		}
		Appointment rhs = (Appointment) object;
		return new EqualsBuilder().append(this.appointId, rhs.appointId)
				.append(this.subject, rhs.subject).append(this.startTime,
						rhs.startTime).append(this.endTime, rhs.endTime)
				.append(this.content, rhs.content)
				.append(this.notes, rhs.notes).append(this.location,
						rhs.location).append(this.inviteEmails,
						rhs.inviteEmails).append(this.isMsg, rhs.isMsg).append(
						this.isMobile, rhs.isMobile).isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.appointId).append(this.subject).append(
						this.startTime).append(this.endTime).append(
						this.content).append(this.notes).append(this.location)
				.append(this.inviteEmails).append(this.isMsg).append(
						this.isMobile).toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this).append("appointId", this.appointId)
				.append("subject", this.subject).append("startTime",
						this.startTime).append("endTime", this.endTime).append(
						"content", this.content).append("notes", this.notes)
				.append("location", this.location).append("inviteEmails",
						this.inviteEmails).append("isMsg", this.isMsg).append(
						"isMobile", this.isMobile).toString();
	}

}
