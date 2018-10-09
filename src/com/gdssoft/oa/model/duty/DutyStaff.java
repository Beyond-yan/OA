package com.gdssoft.oa.model.duty;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * DutyStaff Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class DutyStaff extends com.gdssoft.core.model.BaseModel {

    protected Long id;
	protected java.util.Date dutyDate;
	protected Long sectionId;
	protected com.gdssoft.oa.model.duty.DutyPlan DutyPlan;
	protected com.gdssoft.oa.model.system.AppUser appUser;
	protected Integer days;
	protected String amName;
	protected String pmName;


	/**
	 * Default Empty Constructor for class DutyStaff
	 */
	public DutyStaff () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class DutyStaff
	 */
	public DutyStaff (
		 Long in_id
        ) {
		this.setId(in_id);
    }

	
	public com.gdssoft.oa.model.duty.DutyPlan getDutyPlan () {
		return DutyPlan;
	}	
	
	public void setDutyPlan (com.gdssoft.oa.model.duty.DutyPlan in_DutyPlan) {
		this.DutyPlan = in_DutyPlan;
	}
    
	

	public com.gdssoft.oa.model.system.AppUser getAppUser() {
		return appUser;
	}

	public void setAppUser(com.gdssoft.oa.model.system.AppUser appUser) {
		this.appUser = appUser;
	}

	/**
	 * 	 * @return Long
     * @hibernate.id column="ID" type="java.lang.Long" generator-class="native"
	 */
	public Long getId() {
		return this.id;
	}
	
	/**
	 * Set the id
	 */	
	public void setId(Long aValue) {
		this.id = aValue;
	}	

	/**
	 * 	 * @return Long
	 */
	public Long getPlanId() {
		return this.getDutyPlan()==null?null:this.getDutyPlan().getId();
	}
	
	/**
	 * Set the planId
	 */	
	public void setPlanId(Long aValue) {
	    if (aValue==null) {
	    	DutyPlan = null;
	    } else if (DutyPlan == null) {
	        DutyPlan = new com.gdssoft.oa.model.duty.DutyPlan(aValue);
	        DutyPlan.setVersion(new Integer(0));//set a version to cheat hibernate only
	    } else {
			DutyPlan.setId(aValue);
	    }
	}	

	/**
	 * 	 * @return Long
	 */
	public Long getDutyId() {
		return this.getAppUser()==null?null:this.getAppUser().getUserId();
	}
	
	/**
	 * Set the dutyId
	 */	
	public void setDutyId(Long aValue) {
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
	 * @hibernate.property column="DUTY_DATE" type="java.util.Date" length="7" not-null="false" unique="false"
	 */
	public java.util.Date getDutyDate() {
		return this.dutyDate;
	}
	
	/**
	 * Set the dutyDate
	 */	
	public void setDutyDate(java.util.Date aValue) {
		this.dutyDate = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="SECTION_ID" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public Long getSectionId() {
		return this.sectionId;
	}
	
	/**
	 * Set the sectionId
	 */	
	public void setSectionId(Long aValue) {
		this.sectionId = aValue;
	}	
	

	public Integer getDays() {
		return days;
	}

	public void setDays(Integer days) {
		this.days = days;
	}

	public String getAmName() {
		return amName;
	}

	public void setAmName(String amName) {
		this.amName = amName;
	}

	public String getPmName() {
		return pmName;
	}

	public void setPmName(String pmName) {
		this.pmName = pmName;
	}

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof DutyStaff)) {
			return false;
		}
		DutyStaff rhs = (DutyStaff) object;
		return new EqualsBuilder()
				.append(this.id, rhs.id)
				.append(this.dutyDate, rhs.dutyDate)
				.append(this.sectionId, rhs.sectionId)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.id) 
				.append(this.dutyDate) 
				.append(this.sectionId) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("id", this.id) 
				.append("dutyDate", this.dutyDate) 
				.append("sectionId", this.sectionId) 
				.toString();
	}



}
