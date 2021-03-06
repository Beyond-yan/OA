package com.gdssoft.oa.model.admin;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * @description conf_attend
 * @author YHZ
 * @data 2010-10-08 PM
 * 
 */
public class ConfAttend extends com.gdssoft.core.model.BaseModel {

	private static final long serialVersionUID = 1L;

	protected Conference confId;
	//protected Long confId;
	protected Long attendId;
	protected Long userId;
	protected Short userType;
	protected String fullname;

	/**
	 * Default Empty Constructor for class ConfAttend
	 */
	public ConfAttend() {
		super();
	}

	/**
	 * Default Key Fields Constructor for class ConfAttend
	 */
	public ConfAttend(Long in_attendId) {
		this.setAttendId(in_attendId);
	}

	/**
	 * * @return Integer
	 * 
	 * @hibernate.id column="attendId" type="java.lang.Integer"
	 *               generator-class="native"
	 */
	public Long getAttendId() {
		return this.attendId;
	}

	/**
	 * Set the attendId
	 */
	public void setAttendId(Long aValue) {
		this.attendId = aValue;
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
	public void setConfId(Conference confId) {
		this.confId = confId;
	}

	/**
	 * * @return Integer
	 * 
	 * @hibernate.property column="userId" type="java.lang.Integer" length="10"
	 *                     not-null="false" unique="false"
	 */
	public Long getUserId() {
		return this.userId;
	}

	/**
	 * Set the userId
	 */
	public void setUserId(Long aValue) {
		this.userId = aValue;
	}

	/**
	 * * @return Short
	 * 
	 * @hibernate.property column="userType" type="java.lang.Short" length="5"
	 *                     not-null="false" unique="false"
	 */
	public Short getUserType() {
		return this.userType;
	}

	/**
	 * Set the userType
	 */
	public void setUserType(Short aValue) {
		this.userType = aValue;
	}

	/**
	 * * @return String
	 * 
	 * @hibernate.property column="fullname" type="java.lang.String" length="50"
	 *                     not-null="false" unique="false"
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
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof ConfAttend)) {
			return false;
		}
		ConfAttend rhs = (ConfAttend) object;
		return new EqualsBuilder().append(this.attendId, rhs.attendId).append(
				this.confId, rhs.confId).append(this.userId, rhs.userId)
				.append(this.userType, rhs.userType).append(this.fullname,
						rhs.fullname).isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973).append(this.attendId)
				.append(this.confId).append(this.userId).append(this.userType)
				.append(this.fullname).toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this).append("attendId", this.attendId)
				.append("confId", this.confId).append("userId", this.userId)
				.append("userType", this.userType).append("fullname",
						this.fullname).toString();
	}

}
