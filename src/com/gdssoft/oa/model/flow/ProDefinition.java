package com.gdssoft.oa.model.flow;

/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 */

import org.apache.commons.lang.builder.EqualsBuilder;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;

import flexjson.JSON;

/**
 * ProDefinition Base Java Bean, base class for the.oa.model, mapped directly to
 * database table
 * 
 * Avoid changing this file if not necessary, will be overwritten.
 * 
 * 流程定义
 */
public class ProDefinition extends com.gdssoft.core.model.BaseModel {

	public final static Short IS_DEFAULT = 1;
	public final static Short IS_NOT_DEFAULT = 0;

	protected Long defId;
	protected String name;
	protected String description;
	protected java.util.Date createtime;
	protected String deployId;
	protected Short sequence;// 序号

	protected String defXml;

	protected String drawDefXml;
	// 是否为系统缺省流程
	protected Short isDefault = IS_NOT_DEFAULT;

	protected com.gdssoft.oa.model.flow.ProType proType;

	@JSON
	public String getDefXml() {
		return defXml;
	}

	public void setDefXml(String defXml) {
		this.defXml = defXml;
	}

	/**
	 * Default Empty Constructor for class ProDefinition
	 */
	public ProDefinition() {
		super();
	}

	/**
	 * Default Key Fields Constructor for class ProDefinition
	 */
	public ProDefinition(Long in_defId) {
		this.setDefId(in_defId);
	}

	public com.gdssoft.oa.model.flow.ProType getProType() {
		return proType;
	}

	public void setProType(com.gdssoft.oa.model.flow.ProType in_proType) {
		this.proType = in_proType;
	}

	public void setProTypeId(Long proTypeId) {
		if (proType == null) {
			proType = new ProType();
		}
		proType.setTypeId(proTypeId);
	}

	public Long getProTypeId() {
		return proType == null ? null : proType.getTypeId();
	}

	/**
	 * * @return Long
	 * 
	 * @hibernate.id column="defId" type="java.lang.Long"
	 *               generator-class="native"
	 */
	public Long getDefId() {
		return this.defId;
	}

	/**
	 * Set the defId
	 */
	public void setDefId(Long aValue) {
		this.defId = aValue;
	}

	/**
	 * 分类ID * @return Long
	 */
	public Long getTypeId() {
		return this.getProType() == null ? null : this.getProType().getTypeId();
	}

	/**
	 * Set the typeId
	 */
	public void setTypeId(Long aValue) {
		if (aValue == null) {
			proType = null;
		} else if (proType == null) {
			proType = new com.gdssoft.oa.model.flow.ProType(aValue);
			// proType.setVersion(new Integer(0));//set a version to cheat
			// hibernate only
		} else {
			proType.setTypeId(aValue);
		}
	}

	/**
	 * 流程的名称 * @return String
	 * 
	 * @hibernate.property column="name" type="java.lang.String" length="256"
	 *                     not-null="true" unique="false"
	 */
	public String getName() {
		return this.name;
	}

	/**
	 * Set the name
	 * 
	 * @spring.validator type="required"
	 */
	public void setName(String aValue) {
		this.name = aValue;
	}

	/**
	 * 描述 * @return String
	 * 
	 * @hibernate.property column="description" type="java.lang.String"
	 *                     length="1024" not-null="false" unique="false"
	 */
	public String getDescription() {
		return this.description;
	}

	/**
	 * Set the description
	 */
	public void setDescription(String aValue) {
		this.description = aValue;
	}

	/**
	 * 创建时间 * @return java.util.Date
	 * 
	 * @hibernate.property column="createtime" type="java.util.Date" length="19"
	 *                     not-null="false" unique="false"
	 */
	public java.util.Date getCreatetime() {
		return this.createtime;
	}

	/**
	 * Set the createtime
	 */
	public void setCreatetime(java.util.Date aValue) {
		this.createtime = aValue;
	}

	/**
	 * Jbpm 工作流id * @return String
	 * 
	 * @hibernate.property column="deployId" type="java.lang.String"
	 *                     length="128" not-null="true" unique="false"
	 */
	public String getDeployId() {
		return this.deployId;
	}

	/**
	 * Set the deployId
	 * 
	 * @spring.validator type="required"
	 */
	public void setDeployId(String aValue) {
		this.deployId = aValue;
	}

	public String getDrawDefXml() {
		return drawDefXml;
	}

	public void setDrawDefXml(String drawDefXml) {
		this.drawDefXml = drawDefXml;
	}

	public Short getSequence() {
		return sequence;
	}

	public void setSequence(Short sequence) {
		this.sequence = sequence;
	}

	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof ProDefinition)) {
			return false;
		}
		ProDefinition rhs = (ProDefinition) object;
		return new EqualsBuilder().append(this.defId, rhs.defId).append(
				this.name, rhs.name).append(this.description, rhs.description)
				.append(this.createtime, rhs.createtime).append(this.deployId,
						rhs.deployId).isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973).append(this.defId)
				.append(this.name).append(this.description).append(
						this.createtime).append(this.deployId).toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this).append("defId", this.defId).append(
				"name", this.name).append("description", this.description)
				.append("createtime", this.createtime).append("deployId",
						this.deployId).toString();
	}

	public Short getIsDefault() {
		return isDefault;
	}

	public void setIsDefault(Short isDefault) {
		this.isDefault = isDefault;
	}

}
