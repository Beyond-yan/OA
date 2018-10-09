package com.gdssoft.oa.model.hrm;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;

import com.gdssoft.oa.model.system.FileAttach;
import com.google.gson.annotations.Expose;

/**
 * UserContract Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 */
public class UserContract extends com.gdssoft.core.model.BaseModel {

	@Expose
    protected Long contractId;
	@Expose
    protected Long userId;
	@Expose
	protected String contractNo;
	@Expose
	protected String fullname;
	@Expose
	protected Integer status;
	@Expose
	protected String timeLimit;
	@Expose
	protected Integer isCompeted;
	@Expose
	protected Integer isSecret;
	@Expose
	protected String breakBurden;
	@Expose
	protected String otherItems;
	@Expose
	protected String contractType;
	@Expose
	protected java.util.Date signDate;
	@Expose
	protected java.util.Date startDate;
	@Expose
	protected java.util.Date expireDate;

	@Expose
	protected java.util.Set<FileAttach> contractAttachs = new java.util.HashSet<FileAttach>();
	public java.util.Set<FileAttach> getContractAttachs() {
		return contractAttachs;
	}

	public void setContractAttachs(java.util.Set<FileAttach> contractAttachs) {
		this.contractAttachs =contractAttachs;
	}

	@Expose
	protected java.util.Set contractEvents = new java.util.HashSet();

	/**
	 * Default Empty Constructor for class UserContract
	 */
	public UserContract () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class UserContract
	 */
	public UserContract (
		 Long in_contractId
        ) {
		this.setContractId(in_contractId);
    }

	

	public java.util.Set getContractEvents () {
		return contractEvents;
	}	
	
	public void setContractEvents (java.util.Set in_contractEvents) {
		this.contractEvents = in_contractEvents;
	}
    

	/**
	 * 	 * @return Long
     * @hibernate.id column="contractId" type="java.lang.Long" generator-class="native"
	 */
	public Long getContractId() {
		return this.contractId;
	}
	
	/**
	 * Set the contractId
	 */	
	public void setContractId(Long aValue) {
		this.contractId = aValue;
	}	

	/**
	 * 合同编号
            编号是唯一的，由用户输入，保存若提交生效后，不能进行修改该值	 * @return String
	 * @hibernate.property column="contractNo" type="java.lang.String" length="64" not-null="true" unique="false"
	 */
	public String getContractNo() {
		return this.contractNo;
	}
	
	/**
	 * Set the contractNo
	 * @spring.validator type="required"
	 */	
	public void setContractNo(String aValue) {
		this.contractNo = aValue;
	}	

	/**
	 * 签约职员ID	 * @return Long
	 */
	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long aValue) {
		this.userId = aValue;
	}

	/**
	 * 签约职员名	 * @return String
	 * @hibernate.property column="fullname" type="java.lang.String" length="64" not-null="false" unique="false"
	 */
	public String getFullname() {
		return this.fullname;
	}
	
	/**
	 * Set the fullname
	 */	
	public void setFullname(String aValue) {
		this.fullname = aValue;
	}	

	/**
	 * 合同状态
            0=草稿
            1=有效
            2=终止	 * @return Integer
	 * @hibernate.property column="status" type="java.lang.Integer" length="10" not-null="false" unique="false"
	 */
	public Integer getStatus() {
		return this.status;
	}
	
	/**
	 * Set the status
	 */	
	public void setStatus(Integer aValue) {
		this.status = aValue;
	}	

	/**
	 * 期限形式	 * @return String
	 * @hibernate.property column="timeLimit" type="java.lang.String" length="64" not-null="false" unique="false"
	 */
	public String getTimeLimit() {
		return this.timeLimit;
	}
	
	/**
	 * Set the timeLimit
	 */	
	public void setTimeLimit(String aValue) {
		this.timeLimit = aValue;
	}	

	/**
	 * 是否有竞业条款
            0=无
            1=有	 * @return Integer
	 * @hibernate.property column="isCompeted" type="java.lang.Integer" length="10" not-null="false" unique="false"
	 */
	public Integer getIsCompeted() {
		return this.isCompeted;
	}
	
	/**
	 * Set the isCompeted
	 */	
	public void setIsCompeted(Integer aValue) {
		this.isCompeted = aValue;
	}	

	/**
	 * 是否有保密协议
            0=无
            1=有	 * @return Integer
	 * @hibernate.property column="isSecret" type="java.lang.Integer" length="10" not-null="false" unique="false"
	 */
	public Integer getIsSecret() {
		return this.isSecret;
	}
	
	/**
	 * Set the isSecret
	 */	
	public void setIsSecret(Integer aValue) {
		this.isSecret = aValue;
	}	

	/**
	 * 违约责任	 * @return String
	 * @hibernate.property column="breakBurden" type="java.lang.String" length="4000" not-null="false" unique="false"
	 */
	public String getBreakBurden() {
		return this.breakBurden;
	}
	
	/**
	 * Set the breakBurden
	 */	
	public void setBreakBurden(String aValue) {
		this.breakBurden = aValue;
	}	

	/**
	 * 其他事宜	 * @return String
	 * @hibernate.property column="otherItems" type="java.lang.String" length="4000" not-null="false" unique="false"
	 */
	public String getOtherItems() {
		return this.otherItems;
	}
	
	/**
	 * Set the otherItems
	 */	
	public void setOtherItems(String aValue) {
		this.otherItems = aValue;
	}	

	/**
	 * 合同类型	 * @return String
	 * @hibernate.property column="contractType" type="java.lang.String" length="64" not-null="false" unique="false"
	 */
	public String getContractType() {
		return this.contractType;
	}
	
	/**
	 * Set the contractType
	 */	
	public void setContractType(String aValue) {
		this.contractType = aValue;
	}	

	/**
	 * 签约日期	 * @return java.util.Date
	 * @hibernate.property column="signDate" type="java.util.Date" length="10" not-null="false" unique="false"
	 */
	public java.util.Date getSignDate() {
		return this.signDate;
	}
	
	/**
	 * Set the signDate
	 */	
	public void setSignDate(java.util.Date aValue) {
		this.signDate = aValue;
	}	

	/**
	 * 生效开始日期	 * @return java.util.Date
	 * @hibernate.property column="startDate" type="java.util.Date" length="10" not-null="false" unique="false"
	 */
	public java.util.Date getStartDate() {
		return this.startDate;
	}
	
	/**
	 * Set the startDate
	 */	
	public void setStartDate(java.util.Date aValue) {
		this.startDate = aValue;
	}	

	/**
	 * 满约日期	 * @return java.util.Date
	 * @hibernate.property column="expireDate" type="java.util.Date" length="10" not-null="false" unique="false"
	 */
	public java.util.Date getExpireDate() {
		return this.expireDate;
	}
	
	/**
	 * Set the expireDate
	 */	
	public void setExpireDate(java.util.Date aValue) {
		this.expireDate = aValue;
	}	

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof UserContract)) {
			return false;
		}
		UserContract rhs = (UserContract) object;
		return new EqualsBuilder()
				.append(this.contractId, rhs.contractId)
				.append(this.contractNo, rhs.contractNo)
						.append(this.fullname, rhs.fullname)
				.append(this.status, rhs.status)
				.append(this.timeLimit, rhs.timeLimit)
				.append(this.isCompeted, rhs.isCompeted)
				.append(this.isSecret, rhs.isSecret)
				.append(this.breakBurden, rhs.breakBurden)
				.append(this.otherItems, rhs.otherItems)
				.append(this.contractType, rhs.contractType)
				.append(this.signDate, rhs.signDate)
				.append(this.startDate, rhs.startDate)
				.append(this.expireDate, rhs.expireDate)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.contractId) 
				.append(this.contractNo) 
						.append(this.fullname) 
				.append(this.status) 
				.append(this.timeLimit) 
				.append(this.isCompeted) 
				.append(this.isSecret) 
				.append(this.breakBurden) 
				.append(this.otherItems) 
				.append(this.contractType) 
				.append(this.signDate) 
				.append(this.startDate) 
				.append(this.expireDate) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("contractId", this.contractId) 
				.append("contractNo", this.contractNo) 
						.append("fullname", this.fullname) 
				.append("status", this.status) 
				.append("timeLimit", this.timeLimit) 
				.append("isCompeted", this.isCompeted) 
				.append("isSecret", this.isSecret) 
				.append("breakBurden", this.breakBurden) 
				.append("otherItems", this.otherItems) 
				.append("contractType", this.contractType) 
				.append("signDate", this.signDate) 
				.append("startDate", this.startDate) 
				.append("expireDate", this.expireDate) 
				.toString();
	}



}
