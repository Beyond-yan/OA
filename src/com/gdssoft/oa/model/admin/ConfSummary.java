package com.gdssoft.oa.model.admin;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.util.HashSet;
import java.util.Set;

import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

import com.gdssoft.oa.model.system.FileAttach;

/**
 * @description conf_summary
 * @author YHZ
 * @date 2010-10-8 PM
 * 
 */
@SuppressWarnings("serial")
public class ConfSummary extends com.gdssoft.core.model.BaseModel {

	protected Conference confId;

	protected Long sumId;
	protected java.util.Date createtime;
	protected String creator;
	protected String sumContent;
	protected Short status;
	protected java.util.Date createDate;
	protected String createBy;
	protected java.util.Date updateDate;
	protected String updateBy;
	
	protected Set<FileAttach> attachFiles = new HashSet<FileAttach>();

	public Set<FileAttach> getAttachFiles() {
		return attachFiles;
	}

	public void setAttachFiles(Set<FileAttach> attachFiles) {
		this.attachFiles = attachFiles;
	}

	/**
	 * Default Empty Constructor for class ConfSummary
	 */
	public ConfSummary() {
		super();
	}

	/**
	 * Default Key Fields Constructor for class ConfSummary
	 */
	public ConfSummary(Long in_sumId) {
		this.setSumId(in_sumId);
	}

	/**
	 * * @return Long
	 * 
	 * @hibernate.id column="sumId" type="java.lang.Integer"
	 *               generator-class="native"
	 */
	public Long getSumId() {
		return this.sumId;
	}

	/**
	 * Set the sumId
	 */
	public void setSumId(Long aValue) {
		this.sumId = aValue;
	}

	/**
	 * * @return Integer
	 * 
	 * @hibernate.property column="confId" type="java.lang.Integer" length="10"
	 *                     not-null="false" unique="false"
	 */
	public Conference getConfId() {
		return this.confId;
	}

	/**
	 * Set the confId
	 */
	public void setConfId(Conference conference) {
		this.confId = conference;
	}

	/**
	 * * @return java.util.Date
	 * 
	 * @hibernate.property column="createtime" type="java.util.Date" length="10"
	 *                     not-null="true" unique="false"
	 */
	public java.util.Date getCreatetime() {
		return this.createtime;
	}

	/**
	 * Set the createtime
	 * 
	 * @spring.validator type="required"
	 */
	public void setCreatetime(java.util.Date aValue) {
		this.createtime = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="creator" type="java.lang.String" length="32"
	 *                     not-null="true" unique="false"
	 */
	public String getCreator() {
		return this.creator;
	}

	/**
	 * Set the creator
	 * 
	 * @spring.validator type="required"
	 */
	public void setCreator(String aValue) {
		this.creator = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="sumContent" type="java.lang.String"
	 *                     length="65535" not-null="true" unique="false"
	 */
	public String getSumContent() {
		return this.sumContent;
	}

	/**
	 * Set the sumContent
	 * 
	 * @spring.validator type="required"
	 */
	public void setSumContent(String aValue) {
		this.sumContent = aValue;
	}

	/**
	 * * @return Short
	 * 
	 * @hibernate.property column="status" type="java.lang.Short" length="5"
	 *                     not-null="false" unique="false"
	 */
	public Short getStatus() {
		return this.status;
	}

	/**
	 * Set the status
	 */
	public void setStatus(Short aValue) {
		this.status = aValue;
	}

	
	
	public java.util.Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(java.util.Date createDate) {
		this.createDate = createDate;
	}

	public String getCreateBy() {
		return createBy;
	}

	public void setCreateBy(String createBy) {
		this.createBy = createBy;
	}

	public java.util.Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(java.util.Date updateDate) {
		this.updateDate = updateDate;
	}

	public String getUpdateBy() {
		return updateBy;
	}

	public void setUpdateBy(String updateBy) {
		this.updateBy = updateBy;
	}

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof ConfSummary)) {
			return false;
		}
		ConfSummary rhs = (ConfSummary) object;
		return new EqualsBuilder().append(this.sumId, rhs.sumId).append(
				this.confId, rhs.confId)
				.append(this.createtime, rhs.createtime).append(this.creator,
						rhs.creator).append(this.sumContent, rhs.sumContent)
				.append(this.status, rhs.status)
				.append(this.createDate, rhs.createDate)
				.append(this.createBy, rhs.createBy)
				.append(this.updateDate, rhs.updateDate)
				.append(this.updateBy, rhs.updateBy)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973).append(this.sumId)
				.append(this.confId).append(this.createtime).append(
						this.creator).append(this.sumContent).append(
						this.status).append(this.createDate) 
						.append(this.createBy) 
						.append(this.updateDate) 
						.append(this.updateBy) 
						.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this).append("sumId", this.sumId).append(
				"confId", this.confId).append("createtime", this.createtime)
				.append("creator", this.creator).append("sumContent",
						this.sumContent).append("status", this.status)
						.append("createDate", this.createDate) 
						.append("createBy", this.createBy) 
						.append("updateDate", this.updateDate) 
						.append("updateBy", this.updateBy) 
						.toString();
	}

}
