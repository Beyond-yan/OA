package com.gdssoft.oa.model.summary;

import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;


public class DepartmentSummary extends com.gdssoft.core.model.BaseModel{
	protected Long depid;
	protected String depname;
	protected String depdesc;
	protected Long deplevel;
	protected Long parentid;
	protected String path;
	protected String phone;
	public String getTotal() {
		return total;
	}

	public void setTotal(String total) {
		this.total = total;
	}

	protected String fax;
	protected String total;
	
	protected java.util.Set summaries = new java.util.HashSet();
	
	public DepartmentSummary()
	{
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class SalesOrder
	 */
	public DepartmentSummary (
		 Long depid
        ) {
		this.setDepid(depid);
    }

	public Long getDepid() {
		return depid;
	}

	public void setDepid(Long depid) {
		this.depid = depid;
	}

	public String getDepname() {
		return depname;
	}

	public void setDepname(String depname) {
		this.depname = depname;
	}

	public String getDepdesc() {
		return depdesc;
	}

	public void setDepdesc(String depdesc) {
		this.depdesc = depdesc;
	}

	public Long getDeplevel() {
		return deplevel;
	}

	public void setDeplevel(Long deplevel) {
		this.deplevel = deplevel;
	}

	public Long getParentid() {
		return parentid;
	}

	public void setParentid(Long parentid) {
		this.parentid = parentid;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getFax() {
		return fax;
	}

	public void setFax(String fax) {
		this.fax = fax;
	}

	public java.util.Set getSummaries() {
		return summaries;
	}

	public void setSummaries(java.util.Set summaries) {
		this.summaries = summaries;
	}
	
	/**
	 * @see java.lang.Object#equals(Object)
	 */
	public boolean equals(Object object) {
		if (!(object instanceof DepartmentSummary)) {
			return false;
		}
		DepartmentSummary dept = (DepartmentSummary) object;
		return new EqualsBuilder()
				.append(this.depid, dept.depid)
						.append(this.depname, dept.depname)
				.append(this.total, dept.total)
				.isEquals();
	}
	
	
	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
				.append(this.depid) 
						.append(this.depname) 
				.append(this.total) 
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
				.append("depid", this.depid) 
						.append("depname", this.depname) 
				.append("total", this.total) 
				.toString();
	}
	
}
