package com.gdssoft.oa.model.summary;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * WorkSummarySum Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * 
 */
public class WorkSummarySum extends com.gdssoft.core.model.BaseModel {

    protected Long sumid;
	protected String title;
	protected String type;
	protected int yearNo;
	protected int typeNo;
	protected String sumcontent;
	protected int createUserid;
	protected java.util.Date createDate;
	protected int lasteditUserid;
	protected java.util.Date lasteditDate;
	protected int isAuthorized;


	/**
	 * Default Empty Constructor for class WorkSummarySum
	 */
	public WorkSummarySum () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class WorkSummarySum
	 */
	public WorkSummarySum (
		 Long in_sumid
        ) {
		this.setSumid(in_sumid);
    }

    

	public int getIsAuthorized() {
		return isAuthorized;
	}

	public void setIsAuthorized(int isAuthorized) {
		this.isAuthorized = isAuthorized;
	}

	/**
	 * 	 * @return Long
     * @hibernate.id column="sumid" type="java.lang.Long" generator-class="native"
	 */
	public Long getSumid() {
		return this.sumid;
	}
	
	/**
	 * Set the sumid
	 */	
	public void setSumid(Long aValue) {
		this.sumid = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="title" type="java.lang.String" length="100" not-null="true" unique="false"
	 */
	public String getTitle() {
		return this.title;
	}
	
	/**
	 * Set the title
	 * @spring.validator type="required"
	 */	
	public void setTitle(String aValue) {
		this.title = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="type" type="java.lang.String" length="10" not-null="true" unique="false"
	 */
	public String getType() {
		return this.type;
	}
	
	/**
	 * Set the type
	 * @spring.validator type="required"
	 */	
	public void setType(String aValue) {
		this.type = aValue;
	}	

	/**
	 * 	 * @return int
	 * @hibernate.property column="year_No" type="java.lang.int" length="10" not-null="true" unique="false"
	 */
	public int getYearNo() {
		return this.yearNo;
	}
	
	/**
	 * Set the yearNo
	 * @spring.validator type="required"
	 */	
	public void setYearNo(int aValue) {
		this.yearNo = aValue;
	}	

	/**
	 * 	 * @return int
	 * @hibernate.property column="type_No" type="java.lang.int" length="10" not-null="true" unique="false"
	 */
	public int getTypeNo() {
		return this.typeNo;
	}
	
	/**
	 * Set the typeNo
	 * @spring.validator type="required"
	 */	
	public void setTypeNo(int aValue) {
		this.typeNo = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="sumcontent" type="java.lang.String" length="1073741823" not-null="true" unique="false"
	 */
	public String getSumcontent() {
		return this.sumcontent;
	}
	
	/**
	 * Set the sumcontent
	 * @spring.validator type="required"
	 */	
	public void setSumcontent(String aValue) {
		this.sumcontent = aValue;
	}	


	/**
	 * 	 * @return int
	 * @hibernate.property column="create_userid" type="java.lang.int" length="10" not-null="true" unique="false"
	 */
	public int getCreateUserid() {
		return this.createUserid;
	}
	
	/**
	 * Set the createUserid
	 * @spring.validator type="required"
	 */	
	public void setCreateUserid(int aValue) {
		this.createUserid = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="create_date" type="java.util.Date" length="23" not-null="true" unique="false"
	 */
	public java.util.Date getCreateDate() {
		return this.createDate;
	}
	
	/**
	 * Set the createDate
	 * @spring.validator type="required"
	 */	
	public void setCreateDate(java.util.Date aValue) {
		this.createDate = aValue;
	}	

	/**
	 * 	 * @return int
	 * @hibernate.property column="lastedit_userid" type="java.lang.int" length="10" not-null="true" unique="false"
	 */
	public int getLasteditUserid() {
		return this.lasteditUserid;
	}
	
	/**
	 * Set the lasteditUserid
	 * @spring.validator type="required"
	 */	
	public void setLasteditUserid(int aValue) {
		this.lasteditUserid = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="lastedit_date" type="java.util.Date" length="23" not-null="true" unique="false"
	 */
	public java.util.Date getLasteditDate() {
		return this.lasteditDate;
	}
	
	/**
	 * Set the lasteditDate
	 * @spring.validator type="required"
	 */	
	public void setLasteditDate(java.util.Date aValue) {
		this.lasteditDate = aValue;
	}	

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof WorkSummarySum)) {
			return false;
		}
		WorkSummarySum rhs = (WorkSummarySum) object;
		return new EqualsBuilder()
				.append(this.sumid, rhs.sumid)
				.append(this.title, rhs.title)
				.append(this.type, rhs.type)
				.append(this.yearNo, rhs.yearNo)
				.append(this.typeNo, rhs.typeNo)
				.append(this.sumcontent, rhs.sumcontent)
				.append(this.createUserid, rhs.createUserid)
				.append(this.createDate, rhs.createDate)
				.append(this.lasteditUserid, rhs.lasteditUserid)
				.append(this.lasteditDate, rhs.lasteditDate)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.sumid) 
				.append(this.title) 
				.append(this.type) 
				.append(this.yearNo) 
				.append(this.typeNo) 
				.append(this.sumcontent) 
				.append(this.createUserid) 
				.append(this.createDate) 
				.append(this.lasteditUserid) 
				.append(this.lasteditDate) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("sumid", this.sumid) 
				.append("title", this.title) 
				.append("type", this.type) 
				.append("yearNo", this.yearNo) 
				.append("typeNo", this.typeNo) 
				.append("sumcontent", this.sumcontent) 
				.append("createUserid", this.createUserid) 
				.append("createDate", this.createDate) 
				.append("lasteditUserid", this.lasteditUserid) 
				.append("lasteditDate", this.lasteditDate) 
				.toString();
	}



}
