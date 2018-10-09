package com.gdssoft.oa.model.duty;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * CqDutyPlan Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class DutyPlan extends com.gdssoft.core.model.BaseModel {

    protected Long id;
	protected Long depId;
	protected String planNo;
	protected Long planner;
	protected java.util.Date planDate;
	protected java.util.Date createDate;

	protected java.util.Set DutyStaffs = new java.util.HashSet();

	/**
	 * Default Empty Constructor for class CqDutyPlan
	 */
	public DutyPlan () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class CqDutyPlan
	 */
	public DutyPlan (
		 Long in_id
        ) {
		this.setId(in_id);
    }


	public java.util.Set getDutyStaffs () {
		return DutyStaffs;
	}	
	
	public void setDutyStaffs (java.util.Set in_DutyStaffs) {
		this.DutyStaffs = in_DutyStaffs;
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
	 * @hibernate.property column="DEP_ID" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public Long getDepId() {
		return this.depId;
	}
	
	/**
	 * Set the depId
	 */	
	public void setDepId(Long aValue) {
		this.depId = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="PLAN_NO" type="java.lang.String" length="20" not-null="false" unique="false"
	 */
	public String getPlanNo() {
		return this.planNo;
	}
	
	/**
	 * Set the planNo
	 */	
	public void setPlanNo(String aValue) {
		this.planNo = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="PLANNER" type="java.lang.Long" length="22" not-null="false" unique="false"
	 */
	public Long getPlanner() {
		return this.planner;
	}
	
	/**
	 * Set the planner
	 */	
	public void setPlanner(Long aValue) {
		this.planner = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="PLAN_DATE" type="java.util.Date" length="7" not-null="false" unique="false"
	 */
	public java.util.Date getPlanDate() {
		return this.planDate;
	}
	
	/**
	 * Set the planDate
	 */	
	public void setPlanDate(java.util.Date aValue) {
		this.planDate = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="CREATE_DATE" type="java.util.Date" length="7" not-null="false" unique="false"
	 */
	public java.util.Date getCreateDate() {
		return this.createDate;
	}
	
	/**
	 * Set the createDate
	 */	
	public void setCreateDate(java.util.Date aValue) {
		this.createDate = aValue;
	}	

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof DutyPlan)) {
			return false;
		}
		DutyPlan rhs = (DutyPlan) object;
		return new EqualsBuilder()
				.append(this.id, rhs.id)
				.append(this.depId, rhs.depId)
				.append(this.planNo, rhs.planNo)
				.append(this.planner, rhs.planner)
				.append(this.planDate, rhs.planDate)
				.append(this.createDate, rhs.createDate)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.id) 
				.append(this.depId) 
				.append(this.planNo) 
				.append(this.planner) 
				.append(this.planDate) 
				.append(this.createDate) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("id", this.id) 
				.append("depId", this.depId) 
				.append("planNo", this.planNo) 
				.append("planner", this.planner) 
				.append("planDate", this.planDate) 
				.append("createDate", this.createDate) 
				.toString();
	}



}
