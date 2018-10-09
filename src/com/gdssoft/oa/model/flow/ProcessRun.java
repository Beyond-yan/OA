package com.gdssoft.oa.model.flow;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/

import java.util.Date;

import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;

import com.google.gson.annotations.Expose;

/**
 * ProcessRun Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class ProcessRun extends com.gdssoft.core.model.BaseModel {
	/**
	 * 流程初始化的运行状态，即流程尚未启动
	 */
	public static final Short RUN_STATUS_INIT=0;
	/**
	 * 流程正在运行
	 */
	public static final Short RUN_STATUS_RUNNING=1;
	/**
	 * 流程运行已经结束
	 */
	public static final Short RUN_STATUS_FINISHED=2;
	
	/**
	 * 流程运行已经终止
	 */
	public static final Short RUN_STATUS_STOPED=3;
	public static final Short RUN_STATUS_EXPIRED = 4;
	
    protected Long runId;
    @Expose
	protected String subject;
    @Expose
    protected String creator;
	@Expose
	protected Date createtime;
	@Expose
	protected ProDefinition proDefinition;
	@Expose
	protected String piId;
	@Expose
	protected Short runStatus=RUN_STATUS_INIT;
	
	protected com.gdssoft.oa.model.system.AppUser appUser;

	protected java.util.Set processForms = new java.util.HashSet();
	@Expose
	protected Long  parentId;

	protected Long  archivesId;
	/**
	 * Default Empty Constructor for class ProcessRun
	 */
	public ProcessRun () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class ProcessRun
	 */
	public ProcessRun (
		 Long in_runId
        ) {
		this.setRunId(in_runId);
    }

	
	public ProDefinition getProDefinition() {
		return proDefinition;
	}

	public void setProDefinition(ProDefinition proDefinition) {
		this.proDefinition = proDefinition;
	}

	public com.gdssoft.oa.model.system.AppUser getAppUser () {
		return appUser;
	}	
	
	public void setAppUser (com.gdssoft.oa.model.system.AppUser in_appUser) {
		this.appUser = in_appUser;
	}

	public java.util.Set getProcessForms () {
		return processForms;
	}	
	
	public void setProcessForms (java.util.Set in_processForms) {
		this.processForms = in_processForms;
	}
    

	/**
	 * 	 * @return Long
     * @hibernate.id column="runId" type="java.lang.Long" generator-class="native"
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
	 * 标题
            一般为流程名称＋格式化的时间	 * @return String
	 * @hibernate.property column="subject" type="java.lang.String" length="256" not-null="true" unique="false"
	 */
	public String getSubject() {
		return this.subject;
	}
	
	/**
	 * Set the subject
	 * @spring.validator type="required"
	 */	
	public void setSubject(String aValue) {
		this.subject = aValue;
	}	

	/**
	 * 创建人	 * @return String
	 * @hibernate.property column="creator" type="java.lang.String" length="128" not-null="false" unique="false"
	 */
	public String getCreator() {
		return this.creator;
	}
	
	/**
	 * Set the creator
	 */	
	public void setCreator(String aValue) {
		this.creator = aValue;
	}	

	/**
	 * 所属用户	 * @return Long
	 */
	public Long getUserId() {
		return this.getAppUser()==null?null:this.getAppUser().getUserId();
	}
	
	/**
	 * Set the userId
	 */	
	public void setUserId(Long aValue) {
	    if (aValue==null) {
	    	appUser = null;
	    } else if (appUser == null) {
	        appUser = new com.gdssoft.oa.model.system.AppUser(aValue);
	        appUser.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
			appUser.setUserId(aValue);
	    }
	}	

	
	/**
	 * 流程实例ID	 * @return String
	 * @hibernate.property column="piId" type="java.lang.String" length="64" not-null="false" unique="false"
	 */
	public String getPiId() {
		return this.piId;
	}
	
	/**
	 * Set the piId
	 */	
	public void setPiId(String aValue) {
		this.piId = aValue;
	}	

	
	public Long getParentId() {
		return parentId;
	}

	public void setParentId(Long parentId) {
		this.parentId = parentId;
	}

	public Long getArchivesId() {
		return archivesId;
	}

	public void setArchivesId(Long archivesId) {
		this.archivesId = archivesId;
	}

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof ProcessRun)) {
			return false;
		}
		ProcessRun rhs = (ProcessRun) object;
		return new EqualsBuilder()
				.append(this.runId, rhs.runId)
				.append(this.subject, rhs.subject)
				.append(this.creator, rhs.creator)
				.append(this.piId, rhs.piId)
				.append(this.parentId, rhs.parentId)				
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.runId) 
				.append(this.subject) 
				.append(this.creator)
				.append(this.piId) 
				.append(this.parentId) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("runId", this.runId) 
				.append("subject", this.subject) 
				.append("creator", this.creator)
				.append("piId", this.piId) 
				.append("parentId", this.parentId) 
				.toString();
	}

	public Date getCreatetime() {
		return createtime;
	}

	public void setCreatetime(Date createtime) {
		this.createtime = createtime;
	}

	public Short getRunStatus() {
		return runStatus;
	}

	public void setRunStatus(Short runStatus) {
		this.runStatus = runStatus;
	}


}
