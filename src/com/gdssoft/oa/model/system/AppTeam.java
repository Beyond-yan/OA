package com.gdssoft.oa.model.system;
/*
 *  广州宏天软件有限公司 J.Office协同办公管理系统   -- http://www.jee-soft.cn
 *  Copyright (C) 2008-2010 GuangZhou HongTian Software Limited Company.
*/
import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;

import com.gdssoft.core.model.BaseModel;

/**
 * AppTeam Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class AppTeam extends BaseModel {

    protected Long teamId;
	protected String teamName;
	protected String teamDesc;
	protected java.util.Date createTime;
	protected com.gdssoft.oa.model.system.AppUser appUser;

	protected java.util.Set<AppUser> members = new java.util.HashSet<AppUser>();
	/**
	 * Default Empty Constructor for class AppTeam
	 */
	public AppTeam () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class AppTeam
	 */
	public AppTeam (
		 Long in_teamId
        ) {
		this.setTeamId(in_teamId);
    }

	
	
	public java.util.Set<AppUser> getMembers() {
		return members;
	}

	public void setMembers(java.util.Set<AppUser> members) {
		this.members = members;
	}

	public com.gdssoft.oa.model.system.AppUser getAppUser () {
		return appUser;
	}	
	
	public void setAppUser (com.gdssoft.oa.model.system.AppUser in_appUser) {
		this.appUser = in_appUser;
	}
    

	/**
	 * 	 * @return Long
     * @hibernate.id column="team_id" type="java.lang.Long" generator-class="native"
	 */
	public Long getTeamId() {
		return this.teamId;
	}
	
	/**
	 * Set the teamId
	 */	
	public void setTeamId(Long aValue) {
		this.teamId = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="team_name" type="java.lang.String" length="50" not-null="true" unique="false"
	 */
	public String getTeamName() {
		return this.teamName;
	}
	
	/**
	 * Set the teamName
	 * @spring.validator type="required"
	 */	
	public void setTeamName(String aValue) {
		this.teamName = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="team_desc" type="java.lang.String" length="200" not-null="false" unique="false"
	 */
	public String getTeamDesc() {
		return this.teamDesc;
	}
	
	/**
	 * Set the teamDesc
	 */	
	public void setTeamDesc(String aValue) {
		this.teamDesc = aValue;
	}	

	/**
	 * 	 * @return Long
	 */
	public Long getCreatorId() {
		return this.getAppUser()==null?null:this.getAppUser().getUserId();
	}
	
	/**
	 * Set the creatorId
	 */	
	public void setCreatorId(Long aValue) {
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
	 * 	 * @return java.util.Date
	 * @hibernate.property column="create_time" type="java.util.Date" length="23" not-null="false" unique="false"
	 */
	public java.util.Date getCreateTime() {
		return this.createTime;
	}
	
	/**
	 * Set the createTime
	 */	
	public void setCreateTime(java.util.Date aValue) {
		this.createTime = aValue;
	}	

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof AppTeam)) {
			return false;
		}
		AppTeam rhs = (AppTeam) object;
		return new EqualsBuilder()
				.append(this.teamId, rhs.teamId)
				.append(this.teamName, rhs.teamName)
				.append(this.teamDesc, rhs.teamDesc)
						.append(this.createTime, rhs.createTime)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.teamId) 
				.append(this.teamName) 
				.append(this.teamDesc) 
						.append(this.createTime) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("teamId", this.teamId) 
				.append("teamName", this.teamName) 
				.append("teamDesc", this.teamDesc) 
						.append("createTime", this.createTime) 
				.toString();
	}



}
