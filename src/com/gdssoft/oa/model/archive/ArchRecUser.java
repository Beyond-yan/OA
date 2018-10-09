package com.gdssoft.oa.model.archive;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

import com.gdssoft.oa.model.system.Department;

/**
 * ArchRecUser Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * TODO: add class/table comments
 */
public class ArchRecUser extends com.gdssoft.core.model.BaseModel {

    protected Long archRecId;
	protected Long userId;
	protected String fullname;
	protected Long depId;
	protected String depName;
	protected Department department;
	
	


	public Department getDepartment() {
		return department;
	}

	public void setDepartment(Department department) {
		this.department = department;
	}

	/**
	 * Default Empty Constructor for class ArchRecUser
	 */
	public ArchRecUser () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class ArchRecUser
	 */
	public ArchRecUser (
		 Long in_archRecId
        ) {
		this.setArchRecId(in_archRecId);
    }

    

	/**
	 * 	 * @return Long
     * @hibernate.id column="archRecId" type="java.lang.Long" generator-class="native"
	 */
	public Long getArchRecId() {
		return this.archRecId;
	}
	
	/**
	 * Set the archRecId
	 */	
	public void setArchRecId(Long aValue) {
		this.archRecId = aValue;
	}	

	/**
	 * 	 * @return Long
	 * @hibernate.property column="userId" type="java.lang.Long" length="19" not-null="true" unique="false"
	 */
	public Long getUserId() {
		return this.userId;
	}
	
	/**
	 * Set the userId
	 * @spring.validator type="required"
	 */	
	public void setUserId(Long aValue) {
		this.userId = aValue;
	}	

	/**
	 * 用户名	 * @return String
	 * @hibernate.property column="fullname" type="java.lang.String" length="128" not-null="true" unique="false"
	 */
	public String getFullname() {
		return this.fullname;
	}
	
	/**
	 * Set the fullname
	 * @spring.validator type="required"
	 */	
	public void setFullname(String aValue) {
		this.fullname = aValue;
	}	

	/**
	 * 部门ID 	 * @return Long
	 * @hibernate.property column="depId" type="java.lang.Long" length="19" not-null="true" unique="false"
	 */
	public Long getDepId() {
		return this.depId;
	}
	
	/**
	 * Set the depId
	 * @spring.validator type="required"
	 */	
	public void setDepId(Long aValue) {
		this.depId = aValue;
	}	

	/**
	 * 部门名称	 * @return String
	 * @hibernate.property column="depName" type="java.lang.String" length="128" not-null="true" unique="false"
	 */
	public String getDepName() {
		return this.depName;
	}
	
	/**
	 * Set the depName
	 * @spring.validator type="required"
	 */	
	public void setDepName(String aValue) {
		this.depName = aValue;
	}	

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof ArchRecUser)) {
			return false;
		}
		ArchRecUser rhs = (ArchRecUser) object;
		return new EqualsBuilder()
				.append(this.archRecId, rhs.archRecId)
				.append(this.userId, rhs.userId)
				.append(this.fullname, rhs.fullname)
//				.append(this.depId, rhs.depId)
				.append(this.depName, rhs.depName)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.archRecId) 
				.append(this.userId) 
				.append(this.fullname) 
//				.append(this.depId) 
				.append(this.depName) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("archRecId", this.archRecId) 
				.append("userId", this.userId) 
				.append("fullname", this.fullname) 
//				.append("depId", this.depId) 
				.append("depName", this.depName) 
				.toString();
	}



}
