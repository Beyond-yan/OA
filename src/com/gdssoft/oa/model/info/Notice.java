package com.gdssoft.oa.model.info;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;

import com.gdssoft.oa.model.document.Document;
import com.gdssoft.oa.model.system.FileAttach;
import com.google.gson.annotations.Expose;

public class Notice extends com.gdssoft.core.model.BaseModel {
	//公告属性：公告ID号、发布人、发布标题、发布内容、生效日期、失效日期、当前状态
	@Expose
	private Long noticeId;
	@Expose
	private String postName;
	@Expose
	private String noticeTitle;
	@Expose
	private String noticeContent;
	@Expose
	private Date effectiveDate;
	@Expose
	private Date expirationDate;
	//protected com.gdssoft.oa.model.system.Department department;	
	//状态：1表示正式发布0表示草稿
	@Expose
	private short state;
	@Expose
	private String createUser;
	@Expose
	private String updateUser;
	@Expose
	private Integer type;//该字段用于标记区分公司公告/部门公告/部门文件
	//相应的setter/getter方法
	@Expose
	protected Set attachFiles=new HashSet();
	
	protected com.gdssoft.oa.model.info.InfoType infoType;
	@Expose
	private Long infoTypeId;
	
	public Set getAttachFiles() {
		return attachFiles;
	}

	public void setAttachFiles(Set attachFiles) {
		this.attachFiles = attachFiles;
	}
	
	/*public Set<FileAttach> getAttachFiles() {
		return attachFiles;
	}
	
	public void setAttachFiles(Set<FileAttach> attachFiles) {
		this.attachFiles = attachFiles;
	}*/
	
	public String getPostName() {
		return postName;
	}

	public void setPostName(String postName) {
		this.postName = postName;
	}
	
	public Long getNoticeId() {
		return noticeId;
	}

	public void setNoticeId(Long noticeId) {
		this.noticeId = noticeId;
	}

	public String getNoticeTitle() {
		return noticeTitle;
	}
	public void setNoticeTitle(String noticeTitle) {
		this.noticeTitle = noticeTitle;
	}
	
	public String getNoticeContent() {
		return noticeContent;
	}
	public void setNoticeContent(String noticeContent) {
		this.noticeContent = noticeContent;
	}
	public Date getEffectiveDate() {
		return effectiveDate;
	}
	public void setEffectiveDate(Date effectiveDate) {
		this.effectiveDate = effectiveDate;
	}
	public Date getExpirationDate() {
		return expirationDate;
	}
	public void setExpirationDate(Date expirationDate) {
		this.expirationDate = expirationDate;
	}
	public short getState() {
		return state;
	}
	public void setState(short state) {
		this.state = state;
	}

	public String getCreateUser() {
		return createUser;
	}

	public void setCreateUser(String createUser) {
		this.createUser = createUser;
	}

	public String getUpdateUser() {
		return updateUser;
	}

	public void setUpdateUser(String updateUser) {
		this.updateUser = updateUser;
	}

	//add by smart on 20110513
	@Expose
	protected Long depId; 


	public Long getDepId() {
		return depId;
	}

	public void setDepId(Long depId) {
		this.depId = depId;
	}
	/**
	 * 	 * @return Long
	 * @hibernate.property column="deptid" type="java.lang.Long" length="19" not-null="true" unique="false"
	 */
/*	public Long getDepId() {
		return this.getDepartment()==null?null:this.getDepartment().getDepId();
	}*/
	
	/**
	 * Set the deptid
	 * @spring.validator type="required"
	 */	
/*	public void setDepId(Long aValue) {
	    if (aValue==null) {
	    	department = null;
	    } else if (department == null) {
	        department = new com.gdssoft.oa.model.system.Department(aValue);
	        department.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
			department.setDepId(aValue);
	    }
	}	*/

	@Expose
	protected java.util.Date createtime; 
	
	public java.util.Date getCreatetime() {
		return createtime;
	}
	public void setCreatetime(java.util.Date createtime) {
		this.createtime = createtime;
	}

	@Expose
	private Integer replyCounts;
	@Expose
	private Integer viewCounts;
	public Integer getReplyCounts() {
		return replyCounts;
	}
	public void setReplyCounts(Integer replyCounts) {
		this.replyCounts = replyCounts;
	}
	public Integer getViewCounts() {
		return viewCounts;
	}
	public void setViewCounts(Integer viewCounts) {
		this.viewCounts = viewCounts;
	}
	
	//更新时间
	@Expose
	private java.util.Date updateTime;
		public java.util.Date getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(java.util.Date updateTime) {
		this.updateTime = updateTime;
	}
	////置顶标示
	@Expose
 	protected Integer ordertop;
	public Integer getOrdertop() {
		return ordertop;
	}
	public void setOrdertop(Integer ordertop) {
		this.ordertop = ordertop;
	}

	//审核时间
	@Expose
 	protected java.util.Date auditingCreateDate; 
	public java.util.Date getAuditingCreateDate() {
		return auditingCreateDate;
	} 
	public void setAuditingCreateDate(java.util.Date auditingCreateDate) {
		this.auditingCreateDate = auditingCreateDate;
	} 
	//审核人
	@Expose
 	protected String auditingPerson;
	public String getAuditingPerson() {
		return auditingPerson;
	} 
	public void setAuditingPerson(String auditingPerson) {
		this.auditingPerson = auditingPerson;
	}
	//审核状态
	@Expose
 	protected Integer auditingStatus;
	
	public Integer getAuditingStatus() {
		return auditingStatus;
	}
	
	public void setAuditingStatus(Integer auditingStatus) {
		this.auditingStatus = auditingStatus;
	}
	
	public com.gdssoft.oa.model.info.InfoType getInfoType() {
		return infoType;
	}

	public void setInfoType(com.gdssoft.oa.model.info.InfoType infoType) {
		this.infoType = infoType;
	}

	public Integer getType() {
		return type;
	}
	public void setType(Integer type) {
		this.type = type;
	} 
	
	
	public Long getInfoTypeId() {
		return infoTypeId;
	}

	public void setInfoTypeId(Long infoTypeId) {
		this.infoTypeId = infoTypeId;
	}

	public boolean equals(Object object) {
		if (!(object instanceof Document)) {
			return false;
		}
		Notice rhs = (Notice) object;
		return new EqualsBuilder()
				.append(this.noticeId, rhs.noticeId)
				.append(this.postName, rhs.postName)
				.append(this.noticeTitle, rhs.noticeTitle)
				.append(this.noticeContent, rhs.noticeContent)
				.append(this.effectiveDate, rhs.effectiveDate)
				.append(this.expirationDate, rhs.expirationDate)
				.append(this.state, rhs.state)
				.append(this.depId, rhs.depId)
				.append(this.auditingStatus, rhs.auditingStatus)
				.append(this.auditingPerson, rhs.auditingPerson)
				.append(this.auditingCreateDate, rhs.auditingCreateDate)
				.append(this.createtime, rhs.createtime)
				.append(this.replyCounts, rhs.replyCounts)
				.append(this.viewCounts, rhs.viewCounts)
				.append(this.updateTime, rhs.updateTime)
				.append(this.ordertop, rhs.ordertop)
				.append(this.type, rhs.type)
				.isEquals();
	}
	
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.noticeId) 
				.append(this.postName) 
				.append(this.noticeTitle) 
				.append(this.noticeContent) 
				.append(this.effectiveDate) 
				.append(this.expirationDate) 
				.append(this.state) 
				.append(this.depId) 
				.append(this.auditingStatus) 
				.append(this.auditingPerson) 
				.append(this.auditingCreateDate)
				.append(this.createtime)
				.append(this.replyCounts)
				.append(this.viewCounts)
				.append(this.updateTime)
				.append(this.ordertop)
				.append(this.type)
				.toHashCode();
	}
	
	public String toString() {
		return new ToStringBuilder(this)
		.append("noticeId", this.noticeId)
		.append("postName", this.postName)
		.append("noticeTitle", this.noticeTitle)
		.append("noticeContent", this.noticeContent)
		.append("effectiveDate", this.effectiveDate)
		.append("expirationDate", this.expirationDate)
		.append("state", this.state)
		.append("depId", this.depId)
		.append("auditingStatus", this.auditingStatus)
		.append("auditingPerson", this.auditingPerson)
		.append("auditingCreateDate", this.auditingCreateDate)
		.append("createtime", this.createtime)
		.append("replyCounts", this.replyCounts)
		.append("viewCounts", this.viewCounts)
		.append("updateTime", this.updateTime)
		.append("ordertop", this.ordertop)
		.append("type", this.type)
				.toString();
	}
}
