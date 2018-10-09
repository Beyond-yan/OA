package com.gdssoft.oa.model.out;

import java.util.Date;
import org.apache.commons.lang.builder.HashCodeBuilder;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.EqualsBuilder;
import com.gdssoft.core.model.BaseModel;
import com.gdssoft.oa.model.system.AppUser;

public class OutPerson extends BaseModel {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	protected Long id;
	protected String destiantionAddress;
	protected String outReson;
	protected Date startDate;
	protected Date endDate;
	protected String workConsign;
	protected String createUser;
	protected Date createDate;
	protected String updateUser;
	protected Date updateDate;
	protected String zipCode;
	protected String contactAddress;
	protected String deleted;
	protected String contactName;
	protected String telphone;
	protected String mobilephone;
	protected String fax;
	protected AppUser appUser;

	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getDestiantionAddress() {
		return destiantionAddress;
	}
	public void setDestiantionAddress(String destiantionAddress) {
		this.destiantionAddress = destiantionAddress;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	public String getOutReson() {
		return outReson;
	}
	public void setOutReson(String outReson) {
		this.outReson = outReson;
	}
	public Date getStartDate() {
		return startDate;
	}
	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}
	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}
	public String getWorkConsign() {
		return workConsign;
	}
	public void setWorkConsign(String workConsign) {
		this.workConsign = workConsign;
	}
	public String getCreateUser() {
		return createUser;
	}
	public void setCreateUser(String createUser) {
		this.createUser = createUser;
	}
	public Date getCreateDate() {
		return createDate;
	}
	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}
	public String getUpdateUser() {
		return updateUser;
	}
	public void setUpdateUser(String updateUser) {
		this.updateUser = updateUser;
	}
	public Date getUpdateDate() {
		return updateDate;
	}
	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}
	public String getZipCode() {
		return zipCode;
	}
	public void setZipCode(String zipCode) {
		this.zipCode = zipCode;
	}
	public String getContactAddress() {
		return contactAddress;
	}
	public void setContactAddress(String contactAddress) {
		this.contactAddress = contactAddress;
	}
	public String getDeleted() {
		return deleted;
	}
	public void setDeleted(String deleted) {
		this.deleted = deleted;
	}
	public String getContactName() {
		return contactName;
	}
	public void setContactName(String contactName) {
		this.contactName = contactName;
	}
	public String getTelphone() {
		return telphone;
	}
	public void setTelphone(String telphone) {
		this.telphone = telphone;
	}
	public String getMobilephone() {
		return mobilephone;
	}
	public void setMobilephone(String mobilephone) {
		this.mobilephone = mobilephone;
	}
	public String getFax() {
		return fax;
	}
	public void setFax(String fax) {
		this.fax = fax;
	}
	public AppUser getAppUser() {
		return appUser;
	}
	public void setAppUser(AppUser appUser) {
		this.appUser = appUser;
	}
	
	public boolean equals(Object object) {
		if (!(object instanceof OutPerson)) {
			return false;
		}
		OutPerson rhs = (OutPerson) object;
		return new EqualsBuilder()
				.append(this.id, rhs.id)
				.append(this.destiantionAddress, rhs.destiantionAddress)
				.append(this.outReson, rhs.outReson)
				.append(this.startDate, rhs.startDate)
				.append(this.endDate, rhs.endDate)
				.append(this.workConsign, rhs.workConsign)
				.append(this.zipCode, rhs.zipCode)
				.append(this.contactAddress, rhs.contactAddress)
				.append(this.deleted, rhs.deleted)
				.append(this.contactName, rhs.contactName)
				.append(this.telphone, rhs.telphone)
				.append(this.fax, rhs.fax)
				.append(this.createUser, rhs.createUser)
				.append(this.createDate, rhs.createDate)
				.append(this.updateUser, rhs.updateUser)
				.append(this.updateDate, rhs.updateDate)
				.isEquals();
	}

	/**
	 * @see java.lang.Object#hashCode()
	 */
	public int hashCode() {
		return new HashCodeBuilder(-82280557, -700257973)
		.append(this.id)
		.append(this.destiantionAddress)
		.append(this.outReson)
		.append(this.startDate)
		.append(this.endDate)
		.append(this.workConsign)
		.append(this.zipCode)
		.append(this.contactAddress)
		.append(this.deleted)
		.append(this.contactName)
		.append(this.telphone)
		.append(this.fax)
		.append(this.createUser)
		.append(this.createDate)
		.append(this.updateUser)
		.append(this.updateDate)
				.toHashCode();
	}

	/**
	 * @see java.lang.Object#toString()
	 */
	public String toString() {
		return new ToStringBuilder(this)
		.append(this.id)
		.append(this.destiantionAddress)
		.append(this.outReson)
		.append(this.startDate)
		.append(this.endDate)
		.append(this.workConsign)
		.append(this.zipCode)
		.append(this.contactAddress)
		.append(this.deleted)
		.append(this.contactName)
		.append(this.telphone)
		.append(this.fax)
		.append(this.createUser)
		.append(this.createDate)
		.append(this.updateUser)
		.append(this.updateDate)
				.toString();
	}

}
