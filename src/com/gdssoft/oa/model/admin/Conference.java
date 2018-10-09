package com.gdssoft.oa.model.admin;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */

import java.util.HashSet;
import java.util.Set;

import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;

import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.model.system.FileAttach;

/**
 * @description conference
 * @author YHZ
 * @param <Conference>
 * @date 2010-10-8 PM
 * 
 */
@SuppressWarnings("serial")
public class Conference extends com.gdssoft.core.model.BaseModel {

	/**
	 * 邮件提醒false
	 */
	public static final Short ISNOEMAIL = 0;
	/**
	 * 手机提醒false 0为未发送，1为已发送
	 */
	public static final Short ISNOMOBILE = 0;

	/**
	 * 会议状态:发送
	 */
	public static final Short SEND = 1;

	/**
	 * 会议状态：审批
	 * 会议室申请状态：
	 * 1：申请中；2：审核通过，3：审核不通过，4：已取消，-1：会议已完成
	 * 
	 */
	
	public static final Short Apply = 1;

	/**
	 *    0为未发送，1为已发送
	 */
	public static final Short TEMP = 0;

	protected Long confId;
	protected String confTopic;
	protected String confProperty;
	protected Short importLevel;
	protected Double feeBudget;
	protected String compere;
	protected String recorder;
	protected String attendUsers; //
	protected Short status;
	protected Short isEmail;
	protected Short isMobile;
	protected java.util.Date startTime;
	protected java.util.Date endTime;
	protected Long roomId;
	protected String roomName;
	protected String roomLocation;
	protected String confContent;
	protected String compereName;
	protected String recorderName;
	protected String attendUsersName; //
	protected Long checkUserId;
	protected String checkName;
	protected String checkReason;
	protected java.util.Date createtime;
	protected java.util.Date sendtime;
	protected Long typeId;
	
	//cxt 20110512
	//protected Long applicantId;  201100706
	protected Short applyStatus;
	protected String createBy;
	protected java.util.Date createDate;	
	protected String updateBy;
	protected java.util.Date  updateDate;
	protected String sponsorDept;
	protected String sponsorDeptName;
	protected String compereDept;
	protected String compereDeptName;
	protected String attendDept;
	protected String attendDeptName;
	//protected Long contactUser;
	protected AppUser contUser;
	
	public AppUser getContUser() {
		return contUser;
	}

	public void setContUser(AppUser contUser) {
		this.contUser = contUser;
	}

	protected String contactTel;
	protected String attendConfine;
	
	protected Integer timeType;
	protected Long timeNumber;
	

	
	//app_user表中的
	protected Long depId;
	protected String depName;
	protected String phone;
	
	//20110531
	protected Short isLong;
	protected Long  parentConfId;
	protected Short bookType;
	
	protected String roomContactTel;
	protected AppUser roomContactUser;
	public AppUser getRoomContactUser(){
		return roomContactUser;
	}
	public void setRoomContactUser(AppUser roomContactUser){
		this.roomContactUser = roomContactUser;
	}
	
	

	// 会议权限
	protected Set<ConfPrivilege> confPrivilege = new HashSet<ConfPrivilege>();
	// 附件文件
	protected Set<FileAttach> attachFiles = new HashSet<FileAttach>();
	//cxt
	transient protected Set<ConfAttend> confAttend=new HashSet<ConfAttend>();
	transient protected Set<Department> department=new HashSet<Department>();
	
	transient 	protected com.gdssoft.oa.model.system.AppUser appUser; //20110706

	/**
	 * Default Empty Constructor for class Conference
	 */
	public Conference() {
		super();
	}

	/**
	 * Default Key Fields Constructor for class Conference
	 */
	public Conference(Long in_confId) {
		this.setConfId(in_confId);
	}

	/**
	 * * @return Long
	 * 
	 * @hibernate.id column="confId" type="java.lang.Integer"
	 *               generator-class="native"
	 */
	public Long getConfId() {
		return this.confId;
	}

	/**
	 * Set the confId
	 */
	public void setConfId(Long aValue) {
		this.confId = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="confTopic" type="java.lang.String"
	 *                     length="128" not-null="true" unique="false"
	 */
	public String getConfTopic() {
		return this.confTopic;
	}

	/**
	 * Set the confTopic
	 * 
	 * @spring.validator type="required"
	 */
	public void setConfTopic(String aValue) {
		this.confTopic = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="confProperty" type="java.lang.String"
	 *                     length="64" not-null="false" unique="false"
	 */
	public String getConfProperty() {
		return this.confProperty;
	}

	/**
	 * Set the confProperty
	 */
	public void setConfProperty(String confProperty) {
		this.confProperty = confProperty;
	}
//CXT 
	public Set<ConfAttend> getConfAttend() {
		return confAttend;
	}

	public void setConfAttend(Set<ConfAttend> confAttend) {
		this.confAttend = confAttend;
	}
	
	
	public Set<Department> getDepartment() {
		return department;
	}

	public void setDepartment(Set<Department> department) {
		this.department = department;
	}

	/**
	 * * @return Short
	 * 
	 * @hibernate.property column="importLevel" type="java.lang.Short"
	 *                     length="5" not-null="true" unique="false"
	 */
	public Short getImportLevel() {
		return this.importLevel;
	}



	/**
	 * Set the importLevel
	 * 
	 * @spring.validator type="required"
	 */
	public void setImportLevel(Short aValue) {
		this.importLevel = aValue;
	}

	/**
	 * * @return Double
	 * 
	 * @hibernate.property column="feeBudget" type="java.lang.Double"
	 *                     length="18" not-null="false" unique="false"
	 */
	public Double getFeeBudget() {
		return this.feeBudget;
	}

	/**
	 * Set the feeBudget
	 */
	public void setFeeBudget(Double aValue) {
		this.feeBudget = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="compere" type="java.lang.String" length="64"
	 *                     not-null="false" unique="false"
	 */
	public String getCompere() {
		return this.compere;
	}

	/**
	 * Set the compere
	 */
	public void setCompere(String aValue) {
		this.compere = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="recorder" type="java.lang.String" length="64"
	 *                     not-null="false" unique="false"
	 */
	public String getRecorder() {
		return this.recorder;
	}

	/**
	 * Set the recorder
	 */
	public void setRecorder(String aValue) {
		this.recorder = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="attendUsers" type="java.lang.String"
	 *                     length="500" not-null="false" unique="false"
	 */
	public String getAttendUsers() {
		return this.attendUsers;
	}

	/**
	 * Set the attendUsers
	 */
	public void setAttendUsers(String aValue) {
		this.attendUsers = aValue;
	}

	/**
	 * * @return Short
	 * 
	 * @hibernate.property column="status" type="java.lang.Short" length="5"
	 *                     not-null="true" unique="false"
	 */
	public Short getStatus() {
		return this.status;
	}

	/**
	 * Set the status
	 * 
	 * @spring.validator type="required"
	 */
	public void setStatus(Short aValue) {
		this.status = aValue;
	}

	/**
	 * * @return Short
	 * 
	 * @hibernate.property column="isEmail" type="java.lang.Short" length="5"
	 *                     not-null="false" unique="false"
	 */
	public Short getIsEmail() {
		return this.isEmail;
	}

	/**
	 * Set the isEmail
	 */
	public void setIsEmail(Short aValue) {
		this.isEmail = aValue;
	}

	/**
	 * * @return Short
	 * 
	 * @hibernate.property column="isMobile" type="java.lang.Short" length="5"
	 *                     not-null="false" unique="false"
	 */
	public Short getIsMobile() {
		return this.isMobile;
	}

	/**
	 * Set the isMobile
	 */
	public void setIsMobile(Short aValue) {
		this.isMobile = aValue;
	}

	/**
	 * * @return java.util.Date
	 * 
	 * @hibernate.property column="startTime" type="java.util.Date" length="10"
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
	 * * @return java.util.Date
	 * 
	 * @hibernate.property column="endTime" type="java.util.Date" length="10"
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
	 * * @return Long
	 * 
	 * @hibernate.property column="roomId" type="java.lang.Long" length="10"
	 *                     not-null="false" unique="false"
	 */
	public Long getRoomId() {
		return this.roomId;
	}

	/**
	 * Set the roomId
	 */
	public void setRoomId(Long roomId) {
		this.roomId = roomId;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="roomName" type="java.lang.String" length="64"
	 *                     not-null="false" unique="false"
	 */
	public String getRoomName() {
		return this.roomName;
	}

	/**
	 * Set the roomName
	 */
	public void setRoomName(String aValue) {
		this.roomName = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="roomLocation" type="java.lang.String"
	 *                     length="128" not-null="false" unique="false"
	 */
	public String getRoomLocation() {
		return this.roomLocation;
	}

	/**
	 * Set the roomLocation
	 */
	public void setRoomLocation(String aValue) {
		this.roomLocation = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="confContent" type="java.lang.String"
	 *                     length="65535" not-null="false" unique="false"
	 */
	public String getConfContent() {
		return this.confContent;
	}

	/**
	 * Set the confContent
	 */
	public void setConfContent(String aValue) {
		this.confContent = aValue;
	}

	public String getCompereName() {
		return compereName;
	}

	public void setCompereName(String compereName) {
		this.compereName = compereName;
	}

	public String getRecorderName() {
		return recorderName;
	}

	public void setRecorderName(String recorderName) {
		this.recorderName = recorderName;
	}

	public String getAttendUsersName() {
		return attendUsersName;
	}

	public void setAttendUsersName(String attendUsersName) {
		this.attendUsersName = attendUsersName;
	}

	/**
	 * * @return java.util.Date
	 * 
	 * @hibernate.property column="createtime" type="java.util.Date" length="10"
	 *                     not-null="false" unique="false"
	 */
	public java.util.Date getCreatetime() {
		return this.createtime;
	}

	/**
	 * Set the createtime
	 */
	public void setCreatetime(java.util.Date aValue) {
		this.createtime = aValue;
	}

	/**
	 * * @return java.util.Date
	 * 
	 * @hibernate.property column="sendtime" type="java.util.Date" length="10"
	 *                     not-null="false" unique="false"
	 */
	public java.util.Date getSendtime() {
		return this.sendtime;
	}

	/**
	 * Set the sendtime
	 */
	public void setSendtime(java.util.Date aValue) {
		this.sendtime = aValue;
	}

	public Set<FileAttach> getAttachFiles() {
		return attachFiles;
	}

	public void setAttachFiles(Set<FileAttach> attachFiles) {
		this.attachFiles = attachFiles;
	}

	public Set<ConfPrivilege> getConfPrivilege() {
		return confPrivilege;
	}

	public void setConfPrivilege(Set<ConfPrivilege> confPrivilege) {
		this.confPrivilege = confPrivilege;
	}

	public Long getCheckUserId() {
		return checkUserId;
	}

	public void setCheckUserId(Long checkUserId) {
		this.checkUserId = checkUserId;
	}

	public String getCheckName() {
		return checkName;
	}

	public void setCheckName(String checkName) {
		this.checkName = checkName;
	}

	public String getCheckReason() {
		return checkReason;
	}

	public void setCheckReason(String checkReason) {
		this.checkReason = checkReason;
	}

	public Long getTypeId() {
		return typeId;
	}

	public void setTypeId(Long typeId) {
		this.typeId = typeId;
	}

	//cxt
	

/*	public Long getApplicantId() {
		return applicantId;
	}

	public void setApplicantId(Long applicantId) {
		this.applicantId = applicantId;
	}*/
	public com.gdssoft.oa.model.system.AppUser getAppUser() {
		return appUser;
	}

	public void setAppUser(com.gdssoft.oa.model.system.AppUser appUser) {
		this.appUser = appUser;
	}

	public Long getApplicantId() {
		return this.getAppUser()==null?null:this.getAppUser().getUserId();
	}
	
	
	/**
	 * Set the applicantId
	 */	
	public void setApplicantId(Long aValue) {
	    if (aValue==null) {
	    	appUser = null;
	    } else if (appUser == null) {
	        appUser = new com.gdssoft.oa.model.system.AppUser(aValue);
	        appUser.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
			appUser.setUserId(aValue);
	    }
	}

	public Short getApplyStatus() {
		return applyStatus;
	}

	public void setApplyStatus(Short applyStatus) {
		this.applyStatus = applyStatus;
	}

	public String getCreateBy() {
		return createBy;
	}

	public void setCreateBy(String createBy) {
		this.createBy = createBy;
	}

	public java.util.Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(java.util.Date createDate) {
		this.createDate = createDate;
	}

	public String getUpdateBy() {
		return updateBy;
	}

	public void setUpdateBy(String updateBy) {
		this.updateBy = updateBy;
	}

	public java.util.Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(java.util.Date updateDate) {
		this.updateDate = updateDate;
	}
	
	
	
	
	
	
	public Long getDepId() {
		return depId;
	}

	public void setDepId(Long depId) {
		this.depId = depId;
	}

	public String getDepName() {
		return depName;
	}

	public void setDepName(String depName) {
		this.depName = depName;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	
	
	
	public Short getIsLong() {
		return isLong;
	}

	public void setIsLong(Short isLong) {
		this.isLong = isLong;
	}

	public Long getParentConfId() {
		return parentConfId;
	}

	public void setParentConfId(Long parentConfId) {
		this.parentConfId = parentConfId;
	}

	public Short getBookType() {
		return bookType;
	}

	public void setBookType(Short bookType) {
		this.bookType = bookType;
	}

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof Conference)) {
			return false;
		}
		Conference rhs = (Conference) object;
		return new EqualsBuilder().append(this.confId, rhs.confId).append(
				this.confTopic, rhs.confTopic).append(this.confProperty,
				rhs.confProperty).append(this.importLevel, rhs.importLevel)
				.append(this.feeBudget, rhs.feeBudget).append(this.compere,
						rhs.compere).append(this.recorder, rhs.recorder)
				.append(this.attendUsers, rhs.attendUsers).append(this.status,
						rhs.status).append(this.isEmail, rhs.isEmail).append(
						this.isMobile, rhs.isMobile).append(this.startTime,
						rhs.startTime).append(this.endTime, rhs.endTime)
				.append(this.roomId, rhs.roomId).append(this.roomName,
						rhs.roomName).append(this.roomLocation,
						rhs.roomLocation).append(this.confContent,
						rhs.confContent).append(this.compereName,
						rhs.compereName).append(this.recorderName,
						rhs.recorderName).append(this.attendUsersName,
						rhs.attendUsersName).append(this.checkUserId,
						rhs.checkUserId).append(this.checkName, rhs.checkName)
				.append(this.checkReason, rhs.checkReason).append(
						this.createtime, rhs.createtime).append(this.sendtime,
						rhs.sendtime).append(this.typeId, rhs.typeId)
					//	.append(this.applicantId, rhs.applicantId)
						.append(this.applyStatus, rhs.applyStatus)					
						
						.append(this.isLong, rhs.isLong)
						.append(this.parentConfId, rhs.parentConfId)
						.append(this.bookType, rhs.bookType)
						
						.append(this.createBy, rhs.createBy)
						.append(this.createDate, rhs.createDate)
						.append(this.updateBy, rhs.updateBy)
						.append(this.updateDate, rhs.updateDate)
						
				.isEquals();
	}


	
	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973).append(this.confId)
				.append(this.confTopic).append(this.confProperty).append(
						this.importLevel).append(this.feeBudget).append(
						this.compere).append(this.recorder).append(
						this.attendUsers).append(this.status).append(
						this.isEmail).append(this.isMobile).append(
						this.startTime).append(this.endTime)
				.append(this.roomId).append(this.roomName).append(
						this.roomLocation).append(this.confContent).append(
						this.compereName).append(this.recorderName).append(
						this.attendUsersName).append(this.checkUserId).append(
						this.checkName).append(this.checkReason).append(
						this.createtime).append(this.sendtime).append(
						this.typeId)
						//.append(this.applicantId)
						.append(this.applyStatus)
						
					    .append(this.isLong)
						.append(this.parentConfId)
						.append(this.bookType)	
						
						.append(this.createBy)
						.append(this.createDate)
						.append(this.updateBy)
						.append(this.updateDate)	
						.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this).append("confId", this.confId).append(
				"confTopic", this.confTopic).append("confProperty",
				this.confProperty).append("importLevel", this.importLevel)
				.append("feeBudget", this.feeBudget).append("compere",
						this.compere).append("recorder", this.recorder).append(
						"attendUsers", this.attendUsers).append("status",
						this.status).append("isEmail", this.isEmail).append(
						"isMobile", this.isMobile).append("startTime",
						this.startTime).append("endTime", this.endTime).append(
						"roomId", this.roomId)
				.append("roomName", this.roomName).append("roomLocation",
						this.roomLocation).append("confContent",
						this.confContent).append("compereName",
						this.compereName).append("recorderName",
						this.recorderName).append("attendUsersName",
						this.attendUsersName).append("checkUserId",
						this.checkUserId).append("checkName", this.checkName)
				.append("checkReason", this.checkReason).append("createtime",
						this.createtime).append("sendtime", this.sendtime)
				.append("typeId", this.typeId)
				//.append("applicantId",this.applicantId)
				.append("applyStatus",this.applyStatus)
				
				.append("isLong",this.isLong)
				.append("parentConfId",this.parentConfId)
				.append("bookType",this.bookType)
				
				.append("createBy",this.createBy)
				.append("createDate",this.createDate)
				.append("updateBy",this.updateBy)
				.append("updateDate",this.updateDate).toString();
	}

	public String getSponsorDept() {
		return sponsorDept;
	}

	public void setSponsorDept(String sponsorDept) {
		this.sponsorDept = sponsorDept;
	}

	public String getSponsorDeptName() {
		return sponsorDeptName;
	}

	public void setSponsorDeptName(String sponsorDeptName) {
		this.sponsorDeptName = sponsorDeptName;
	}

	public String getCompereDept() {
		return compereDept;
	}

	public void setCompereDept(String compereDept) {
		this.compereDept = compereDept;
	}

	public String getCompereDeptName() {
		return compereDeptName;
	}

	public void setCompereDeptName(String compereDeptName) {
		this.compereDeptName = compereDeptName;
	}

	public String getAttendDept() {
		return attendDept;
	}

	public void setAttendDept(String attendDept) {
		this.attendDept = attendDept;
	}

	public String getAttendDeptName() {
		return attendDeptName;
	}

	public void setAttendDeptName(String attendDeptName) {
		this.attendDeptName = attendDeptName;
	}

	/*public Long getContactUser() {
		return contactUser;
	}

	public void setContactUser(Long contactUser) {
		this.contactUser = contactUser;
	}*/

	public String getContactTel() {
		return contactTel;
	}

	public void setContactTel(String contactTel) {
		this.contactTel = contactTel;
	}

	public String getAttendConfine() {
		return attendConfine;
	}

	public void setAttendConfine(String attendConfine) {
		this.attendConfine = attendConfine;
	}

	public Integer getTimeType() {
		return timeType;
	}

	public void setTimeType(Integer timeType) {
		this.timeType = timeType;
	}

	public Long getTimeNumber() {
		return timeNumber;
	}

	public void setTimeNumber(Long timeNumber) {
		this.timeNumber = timeNumber;
	}

	public String getRoomContactTel() {
		return roomContactTel;
	}

	public void setRoomContactTel(String roomContactTel) {
		this.roomContactTel = roomContactTel;
	}

	

	
	
	
	
}
