package com.gdssoft.oa.model.flow;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.Map;
import java.util.HashMap;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * CcuserProcess Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class CcuserProcess extends com.gdssoft.core.model.BaseModel {

	protected Long processRunId;
	protected Long ccUserId;
	protected Long createUserId;
	protected java.util.Date createDate;
	protected com.gdssoft.oa.model.system.AppUser appUser;
	protected com.gdssoft.oa.model.system.AppUser createAppUser;
	protected int status;
	private String subjectName;


	/**
	 * Default Empty Constructor for class CcuserProcess
	 */
	public CcuserProcess () {
		super();
	}
	
		
	public Long getProcessRunId() {
		return processRunId;
	}



	public void setProcessRunId(Long processRunId) {
		this.processRunId = processRunId;
	}



	public java.util.Date getCreateDate() {
		return createDate;
	}


	public void setCreateDate(java.util.Date createDate) {
		this.createDate = createDate;
	}


	public com.gdssoft.oa.model.system.AppUser getCreateAppUser() {
		return createAppUser;
	}


	public void setCreateAppUser(com.gdssoft.oa.model.system.AppUser createAppUser) {
		this.createAppUser = createAppUser;
	}


	public com.gdssoft.oa.model.system.AppUser getAppUser () {
		return appUser;
	}	
	
	public void setAppUser (com.gdssoft.oa.model.system.AppUser in_appUser) {
		this.appUser = in_appUser;
	}
	
	/**
	 * 	 * @return Long
	 */
	public Long getCcUserId() {
		return this.getAppUser()==null?null:this.getAppUser().getUserId();
	}
	
	/**
	 * Set the applyUserId
	 */	
	public void setCcUserId(Long aValue) {
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
	 * 	 * @return Long
	 */
	public Long getCreateUserId() {
		return this.getCreateAppUser()==null?null:this.getCreateAppUser().getUserId();
	}
	
	/**
	 * Set the createUserId
	 */	
	public void setCreateUserId(Long aValue) {
	    if (aValue==null) {
	    	createAppUser = null;
	    } else if (createAppUser == null) {
	    	createAppUser = new com.gdssoft.oa.model.system.AppUser(aValue);
	    	createAppUser.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
	    	createAppUser.setUserId(aValue);
	    }
	}


	public int getStatus() {
		return status;
	}


	public void setStatus(int status) {
		this.status = status;
	}


	public void setSubjectName(String subjectName) {
		this.subjectName = subjectName;
	}


	public String getSubjectName() {
		return subjectName;
	}	
	
}
