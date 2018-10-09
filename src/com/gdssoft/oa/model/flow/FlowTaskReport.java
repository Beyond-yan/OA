package com.gdssoft.oa.model.flow;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.Date;

import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * TQueryFlowTodolist Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class FlowTaskReport extends com.gdssoft.core.model.BaseModel {

	protected Long defId;
	protected Long runId;
	protected Long taskId;
	protected String taskName;
	protected String activityname;
	protected String runSubject;
	protected String preActivityname;
	protected Long preUserId;
	protected String preUserName;
	protected Long assignUserId;
	protected String assignUserName;
	protected Long archiveId;
	protected Long issuerId;
	protected String issuer;
	protected java.util.Date archCreateTime;
	protected java.util.Date sendTime;
	protected Integer isReply;
	protected Integer isEnd;
	protected String archivesNo;
	protected String orgdepName;
	protected String issuedep;
	protected Long curDepId;
	protected String curDepName;
	protected String flowName;
	protected String dataValue;
	protected String piid;
	protected String creatorDepName;
	protected Long creatorDepId;
	protected Long preDepId;
	protected String preDepName;
	protected int totalCounts;
	protected Date signDate;
	protected Date writtenDate;
	protected Date issueDate;
	protected String depSignNo;
	protected Date standardApproveDate;
	protected String standardApprover;
	protected Long isComSetting;
	
	public Long getIsComSetting() {
		return isComSetting;
	}

	public void setIsComSetting(Long isComSetting) {
		this.isComSetting = isComSetting;
	}

	public Date getStandardApproveDate() {
		return standardApproveDate;
	}

	public void setStandardApproveDate(Date standardApproveDate) {
		this.standardApproveDate = standardApproveDate;
	}

	public String getStandardApprover() {
		return standardApprover;
	}

	public void setStandardApprover(String standardApprover) {
		this.standardApprover = standardApprover;
	}

	public Date getWrittenDate() {
		return writtenDate;
	}
	protected int status;
	protected java.util.Date  limitedDate;

	public void setWrittenDate(Date writtenDate) {
		this.writtenDate = writtenDate;
	}

	public Date getIssueDate() {
		return issueDate;
	}

	public void setIssueDate(Date issueDate) {
		this.issueDate = issueDate;
	}

	public String getDepSignNo() {
		return depSignNo;
	}

	public void setDepSignNo(String depSignNo) {
		this.depSignNo = depSignNo;
	}

	public Date getSignDate() {
		return signDate;
	}

	public void setSignDate(Date signDate) {
		this.signDate = signDate;
	}
	/**
	 * Default Empty Constructor for class TQueryFlowTodolist
	 */
	public FlowTaskReport () {
		super();
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="DEF_ID" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public Long getDefId() {
		return this.defId;
	}
	
	/**
	 * Set the defId
	 */	
	public void setDefId(Long aValue) {
		this.defId = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="RUN_ID" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public Long getRunId() {
		return this.runId;
	}
	
	/**
	 * Set the runId
	 */	
	public void setRunId(Long aValue) {
		this.runId = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="TASK_ID" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public Long getTaskId() {
		return this.taskId;
	}
	
	/**
	 * Set the taskId
	 */	
	public void setTaskId(Long aValue) {
		this.taskId = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="TASK_NAME" type="java.lang.String" length="400" not-null="false" unique="false"
	 */
	public String getTaskName() {
		return this.taskName;
	}
	
	/**
	 * Set the taskName
	 */	
	public void setTaskName(String aValue) {
		this.taskName = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="ACTIVITYNAME" type="java.lang.String" length="400" not-null="false" unique="false"
	 */
	public String getActivityname() {
		return this.activityname;
	}
	
	/**
	 * Set the activityname
	 */	
	public void setActivityname(String aValue) {
		this.activityname = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="RUN_SUBJECT" type="java.lang.String" length="800" not-null="false" unique="false"
	 */
	public String getRunSubject() {
		return this.runSubject;
	}
	
	/**
	 * Set the runSubject
	 */	
	public void setRunSubject(String aValue) {
		this.runSubject = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="PRE_ACTIVITYNAME" type="java.lang.String" length="800" not-null="false" unique="false"
	 */
	public String getPreActivityname() {
		return this.preActivityname;
	}
	
	/**
	 * Set the preActivityname
	 */	
	public void setPreActivityname(String aValue) {
		this.preActivityname = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="PRE_USER_ID" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public Long getPreUserId() {
		return this.preUserId;
	}
	
	/**
	 * Set the preUserId
	 */	
	public void setPreUserId(Long aValue) {
		this.preUserId = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="PRE_USER_NAME" type="java.lang.String" length="800" not-null="false" unique="false"
	 */
	public String getPreUserName() {
		return this.preUserName;
	}
	
	/**
	 * Set the preUserName
	 */	
	public void setPreUserName(String aValue) {
		this.preUserName = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="ASSIGN_USER_ID" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public Long getAssignUserId() {
		return this.assignUserId;
	}
	
	/**
	 * Set the assignUserId
	 */	
	public void setAssignUserId(Long aValue) {
		this.assignUserId = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="ASSIGN_USER_NAME" type="java.lang.String" length="800" not-null="false" unique="false"
	 */
	public String getAssignUserName() {
		return this.assignUserName;
	}
	
	/**
	 * Set the assignUserName
	 */	
	public void setAssignUserName(String aValue) {
		this.assignUserName = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="ARCHIVE_ID" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public Long getArchiveId() {
		return this.archiveId;
	}
	
	/**
	 * Set the archiveId
	 */	
	public void setArchiveId(Long aValue) {
		this.archiveId = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="ISSUER_ID" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public Long getIssuerId() {
		return this.issuerId;
	}
	
	/**
	 * Set the issuerId
	 */	
	public void setIssuerId(Long aValue) {
		this.issuerId = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="ISSUER" type="java.lang.String" length="100" not-null="false" unique="false"
	 */
	public String getIssuer() {
		return this.issuer;
	}
	
	/**
	 * Set the issuer
	 */	
	public void setIssuer(String aValue) {
		this.issuer = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="ARCH_CREATE_TIME" type="java.util.Date" length="7" not-null="false" unique="false"
	 */
	public java.util.Date getArchCreateTime() {
		return this.archCreateTime;
	}
	
	/**
	 * Set the archCreateTime
	 */	
	public void setArchCreateTime(java.util.Date aValue) {
		this.archCreateTime = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="SEND_TIME" type="java.util.Date" length="7" not-null="false" unique="false"
	 */
	public java.util.Date getSendTime() {
		return this.sendTime;
	}
	
	/**
	 * Set the sendTime
	 */	
	public void setSendTime(java.util.Date aValue) {
		this.sendTime = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="IS_REPLY" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public Integer getIsReply() {
		return this.isReply;
	}
	
	/**
	 * Set the isReply
	 */	
	public void setIsReply(Integer aValue) {
		this.isReply = aValue;
	}	
	public Integer getIsEnd() {
		return this.isEnd;
	}
	
	public void setIsEnd(Integer aValue) {
		this.isEnd = aValue;
	}	
	/**
	 * 	 * @return String
	 * @hibernate.property column="ARCHIVES_NO" type="java.lang.String" length="200" not-null="false" unique="false"
	 */
	public String getArchivesNo() {
		return this.archivesNo;
	}
	
	/**
	 * Set the archivesNo
	 */	
	public void setArchivesNo(String aValue) {
		this.archivesNo = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="ORGDEP_NAME" type="java.lang.String" length="800" not-null="false" unique="false"
	 */
	public String getOrgdepName() {
		return this.orgdepName;
	}
	
	/**
	 * Set the orgdepName
	 */	
	public void setOrgdepName(String aValue) {
		this.orgdepName = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="ISSUEDEP" type="java.lang.String" length="800" not-null="false" unique="false"
	 */
	public String getIssuedep() {
		return this.issuedep;
	}
	
	/**
	 * Set the issuedep
	 */	
	public void setIssuedep(String aValue) {
		this.issuedep = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="CUR_DEP_ID" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public Long getCurDepId() {
		return this.curDepId;
	}
	
	/**
	 * Set the curDepId
	 */	
	public void setCurDepId(Long aValue) {
		this.curDepId = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="CUR_DEP_NAME" type="java.lang.String" length="800" not-null="false" unique="false"
	 */
	public String getCurDepName() {
		return this.curDepName;
	}
	
	/**
	 * Set the curDepName
	 */	
	public void setCurDepName(String aValue) {
		this.curDepName = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="FLOW_NAME" type="java.lang.String" length="800" not-null="false" unique="false"
	 */
	public String getFlowName() {
		return this.flowName;
	}
	
	/**
	 * Set the flowName
	 */	
	public void setFlowName(String aValue) {
		this.flowName = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="DATA_VALUE" type="java.lang.String" length="800" not-null="false" unique="false"
	 */
	public String getDataValue() {
		return this.dataValue;
	}
	
	/**
	 * Set the dataValue
	 */	
	public void setDataValue(String aValue) {
		this.dataValue = aValue;
	}	
	public String getPiid() {
		return piid;
	}

	public void setPiid(String piid) {
		this.piid = piid;
	}

	public String getCreatorDepName() {
		return creatorDepName;
	}

	public void setCreatorDepName(String creatorDepName) {
		this.creatorDepName = creatorDepName;
	}

	public Long getCreatorDepId() {
		return creatorDepId;
	}

	public void setCreatorDepId(Long creatorDepId) {
		this.creatorDepId = creatorDepId;
	}
	
	public Long getPreDepId() {
		return preDepId;
	}

	public void setPreDepId(Long preDepId) {
		this.preDepId = preDepId;
	}

	public String getPreDepName() {
		return preDepName;
	}

	public void setPreDepName(String preDepName) {
		this.preDepName = preDepName;
	}
	
	public int getTotalCounts() {
		return totalCounts;
	}

	public void setTotalCounts(int totalCounts) {
		this.totalCounts = totalCounts;
	}
	
	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}
	public java.util.Date getLimitedDate() {
		return limitedDate;
	}

	public void setLimitedDate(java.util.Date limitedDate) {
		this.limitedDate = limitedDate;
	}


	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof FlowTaskReport)) {
			return false;
		}
		FlowTaskReport rhs = (FlowTaskReport) object;
		return new EqualsBuilder()
				.append(this.defId, rhs.defId)
				.append(this.runId, rhs.runId)
				.append(this.taskId, rhs.taskId)
				.append(this.taskName, rhs.taskName)
				.append(this.activityname, rhs.activityname)
				.append(this.runSubject, rhs.runSubject)
				.append(this.preActivityname, rhs.preActivityname)
				.append(this.preUserId, rhs.preUserId)
				.append(this.preUserName, rhs.preUserName)
				.append(this.assignUserId, rhs.assignUserId)
				.append(this.assignUserName, rhs.assignUserName)
				.append(this.archiveId, rhs.archiveId)
				.append(this.issuerId, rhs.issuerId)
				.append(this.issuer, rhs.issuer)
				.append(this.archCreateTime, rhs.archCreateTime)
				.append(this.sendTime, rhs.sendTime)
				.append(this.isReply, rhs.isReply)
				.append(this.archivesNo, rhs.archivesNo)
				.append(this.orgdepName, rhs.orgdepName)
				.append(this.issuedep, rhs.issuedep)
				.append(this.curDepId, rhs.curDepId)
				.append(this.curDepName, rhs.curDepName)
				.append(this.flowName, rhs.flowName)
				.append(this.dataValue, rhs.dataValue)
				.append(this.dataValue, rhs.limitedDate)
				.append(this.dataValue, rhs.status)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.defId) 
				.append(this.runId) 
				.append(this.taskId) 
				.append(this.taskName) 
				.append(this.activityname) 
				.append(this.runSubject) 
				.append(this.preActivityname) 
				.append(this.preUserId) 
				.append(this.preUserName) 
				.append(this.assignUserId) 
				.append(this.assignUserName) 
				.append(this.archiveId) 
				.append(this.issuerId) 
				.append(this.issuer) 
				.append(this.archCreateTime) 
				.append(this.sendTime) 
				.append(this.isReply) 
				.append(this.archivesNo) 
				.append(this.orgdepName) 
				.append(this.issuedep) 
				.append(this.curDepId) 
				.append(this.curDepName) 
				.append(this.flowName) 
				.append(this.dataValue) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("defId", this.defId) 
				.append("runId", this.runId) 
				.append("taskId", this.taskId) 
				.append("taskName", this.taskName) 
				.append("activityname", this.activityname) 
				.append("runSubject", this.runSubject) 
				.append("preActivityname", this.preActivityname) 
				.append("preUserId", this.preUserId) 
				.append("preUserName", this.preUserName) 
				.append("assignUserId", this.assignUserId) 
				.append("assignUserName", this.assignUserName) 
				.append("archiveId", this.archiveId) 
				.append("issuerId", this.issuerId) 
				.append("issuer", this.issuer) 
				.append("archCreateTime", this.archCreateTime) 
				.append("sendTime", this.sendTime) 
				.append("isReply", this.isReply) 
				.append("archivesNo", this.archivesNo) 
				.append("orgdepName", this.orgdepName) 
				.append("issuedep", this.issuedep) 
				.append("curDepId", this.curDepId) 
				.append("curDepName", this.curDepName) 
				.append("flowName", this.flowName) 
				.append("dataValue", this.dataValue) 
				.toString();
	}



}
