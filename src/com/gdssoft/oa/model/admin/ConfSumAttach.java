package com.gdssoft.oa.model.admin;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;

/**
 * @description conf_sum_attach
 * @author YHZ
 * @date 2010-10-8 PM
 * 
 */
public class ConfSumAttach extends com.gdssoft.core.model.BaseModel {

	protected ConfSummary sumId;

	private static final long serialVersionUID = 1L;
	protected Integer fileId;

	/**
	 * Default Empty Constructor for class ConfSumAttach
	 */
	public ConfSumAttach() {
		super();
	}

	/**
	 * * @return Integer
	 * 
	 * @hibernate.property column="sumId" type="java.lang.Integer" length="10"
	 *                     not-null="false" unique="false"
	 */
	public ConfSummary getSumId() {
		return this.sumId;
	}

	/**
	 * Set the sumId
	 */
	public void setSumId(ConfSummary confSummary) {
		this.sumId = confSummary;
	}

	/**
	 * * @return Integer
	 * 
	 * @hibernate.property column="fileId" type="java.lang.Integer" length="10"
	 *                     not-null="false" unique="false"
	 */
	public Integer getFileId() {
		return this.fileId;
	}

	/**
	 * Set the fileId
	 */
	public void setFileId(Integer aValue) {
		this.fileId = aValue;
	}

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof ConfSumAttach)) {
			return false;
		}
		ConfSumAttach rhs = (ConfSumAttach) object;
		return new EqualsBuilder().append(this.sumId, rhs.sumId).append(
				this.fileId, rhs.fileId).isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973).append(this.sumId)
				.append(this.fileId).toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this).append("sumId", this.sumId).append(
				"fileId", this.fileId).toString();
	}

}
