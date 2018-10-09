package com.gdssoft.oa.model.system;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/

import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.jbpm.api.identity.User;
import org.springframework.security.GrantedAuthority;
import org.springframework.security.GrantedAuthorityImpl;
import org.springframework.security.userdetails.UserDetails;

import com.gdssoft.oa.model.personal.PersonnelEmployee;
import com.google.gson.annotations.Expose;



/**
 * AppUser Base Java Bean, base class for the.oa.model, mapped directly to database table
 * 
 * Avoid changing this file if not necessary, will be overwritten. 
 *
 * TODO: add class/table comments
 */
public class AppUser extends com.gdssoft.core.model.BaseModel implements UserDetails,User{
	/**
	 * 
	 */
	private static final long serialVersionUID =1L;
	/**
	 * 系统用户ID，由初始化数据加入
	 */
	public static Long SYSTEM_USER=new Long(-1);
	/**
	 * 超级管理员ID,由初始化数据加入
	 */
	public static Long SUPER_USER=new Long(1);
	@Expose
    protected Long userId;
	@Expose
	protected String username;
	protected String password;
	@Expose
	protected String email;
	@Expose
	protected Department department;
	@Expose
	protected String position;
	@Expose
	protected String phone;
	@Expose
	protected String mobile;
	@Expose
	protected String fax;
	@Expose
	protected String address;
	@Expose
	protected String zip;
	@Expose
	protected String photo;
	@Expose
	protected java.util.Date accessionTime;

	@Expose
	protected java.util.Date birthday;


	public java.util.Date getBirthday() {
		return birthday;
	}

	public void setBirthday(java.util.Date birthday) {
		this.birthday = birthday;
	}

	@Expose
	protected Short status;
	@Expose
	protected String education;
	@Expose
	protected Short title;
	@Expose
	protected String fullname;
	@Expose
	protected Long userlevel;
	@Expose
	protected String idNumber;
	@Expose
	protected Short delFlag;
	@Expose
	protected java.math.BigDecimal capacity;	

	private Set<PersonnelEmployee> personnelEmployee; 
	
	private PersonnelEmployee tmpPersonnelEmployee;
	
	public Set<PersonnelEmployee> getPersonnelEmployee()
	{
		return personnelEmployee;
	}

	public void setPersonnelEmployee(Set<PersonnelEmployee> personnelEmployee)
	{
		this.personnelEmployee = personnelEmployee;
	}

	@Expose
	protected java.math.BigDecimal inUseCapacity;

	transient private Set<AppRole> roles;
	
	

	private String emailName;
	
	private String depCode;
	
	private String organization;
	
	private Boolean isDineAdmin;
	
	private Boolean isDepMonitorAdmin;//是否部门督办管理员
	
	private Boolean isAdmin;//是否管理员
	
	private Boolean isDeptFlowAdmin;//是否部门(流程)管理员
	private Short disturb;
	/**
	 * 用于存储该用户的权限
	 */
	private Set<String> rights=new HashSet<String>();
	
	private Long ownerSchemaId;
	public Long getOwnerSchemaId() {
		return ownerSchemaId;
	}

	public void setOwnerSchemaId(Long ownerSchemaId) {
		this.ownerSchemaId = ownerSchemaId;
	}

	/**
	 * 所属schema
	 */
	private String ownerSchema;
	
	public Short getDisturb() {
		return disturb;
	}

	public void setDisturb(Short disturb) {
		this.disturb = disturb;
	}

	public String getOwnerSchema() {
		return ownerSchema;
	}

	public void setOwnerSchema(String ownerSchema) {
		this.ownerSchema = ownerSchema;
	}

	public Set<String> getRights() {
		return rights;
	}
	
	/**
	 * 取得所有的Function的权限，则以_为开头的权限
	 * @return
	 */
	public String getFunctionRights(){
		StringBuffer sb=new StringBuffer();
		
		Iterator<String>it=rights.iterator();
		
		while(it.hasNext()){
			sb.append(it.next()).append(",");
		}
		
		if(rights.size()>0){
			sb.deleteCharAt(sb.length()-1);
		}
		
		return sb.toString();
	}

	public void setRights(Set<String> rights) {
		this.rights = rights;
	}

	/**
	 * Default Empty Constructor for class AppUser
	 */
	public AppUser () {
		super();
	}
	
	/**
	 * Default Key Fields Constructor for class AppUser
	 */
	public AppUser (
		 Long in_userId
        ) {
		this.setUserId(in_userId);
    }

	/**
	 * 	 * @return Long
     * @hibernate.id column="userId" type="java.lang.Long" generator-class="native"
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
	 * 	 * @return String
	 * @hibernate.property column="username" type="java.lang.String" length="128" not-null="true" unique="false"
	 */
	public String getUsername() {
		return this.username;
	}
	
	/**
	 * Set the username
	 * @spring.validator type="required"
	 */	
	public void setUsername(String aValue) {
		this.username = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="password" type="java.lang.String" length="128" not-null="true" unique="false"
	 */
	public String getPassword() {
		return this.password;
	}
	
	/**
	 * Set the password
	 * @spring.validator type="required"
	 */	
	public void setPassword(String aValue) {
		this.password = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="email" type="java.lang.String" length="128" not-null="true" unique="false"
	 */
	public String getEmail() {
		return this.email;
	}
	
	/**
	 * Set the email
	 * @spring.validator type="required"
	 */	
	public void setEmail(String aValue) {
		this.email = aValue;
	}	

	

	public Department getDepartment() {
		return department;
	}

	public void setDepartment(Department department) {
		this.department = department;
	}

	/**
	 * 	 * @return String
	 * @hibernate.property column="position" type="java.lang.String" length="32" not-null="false" unique="false"
	 */
	public String getPosition() {
		return this.position;
	}
	
	/**
	 * Set the position
	 */	
	public void setPosition(String aValue) {
		this.position = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="phone" type="java.lang.String" length="32" not-null="false" unique="false"
	 */
	public String getPhone() {
		return this.phone;
	}
	
	/**
	 * Set the phone
	 */	
	public void setPhone(String aValue) {
		this.phone = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="mobile" type="java.lang.String" length="32" not-null="false" unique="false"
	 */
	public String getMobile() {
		return this.mobile;
	}
	
	/**
	 * Set the mobile
	 */	
	public void setMobile(String aValue) {
		this.mobile = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="fax" type="java.lang.String" length="32" not-null="false" unique="false"
	 */
	public String getFax() {
		return this.fax;
	}
	
	/**
	 * Set the fax
	 */	
	public void setFax(String aValue) {
		this.fax = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="address" type="java.lang.String" length="64" not-null="false" unique="false"
	 */
	public String getAddress() {
		return this.address;
	}
	
	/**
	 * Set the address
	 */	
	public void setAddress(String aValue) {
		this.address = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="zip" type="java.lang.String" length="32" not-null="false" unique="false"
	 */
	public String getZip() {
		return this.zip;
	}
	
	/**
	 * Set the zip
	 */	
	public void setZip(String aValue) {
		this.zip = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="photo" type="java.lang.String" length="128" not-null="false" unique="false"
	 */
	public String getPhoto() {
		return this.photo;
	}
	
	/**
	 * Set the photo
	 */	
	public void setPhoto(String aValue) {
		this.photo = aValue;
	}	

	/**
	 * 	 * @return java.util.Date
	 * @hibernate.property column="accessionTime" type="java.util.Date" length="19" not-null="true" unique="false"
	 */
	public java.util.Date getAccessionTime() {
		return this.accessionTime;
	}
	
	/**
	 * Set the accessionTime
	 * @spring.validator type="required"
	 */	
	public void setAccessionTime(java.util.Date aValue) {
		this.accessionTime = aValue;
	}	

	/**
	 * 	 * @return Short
	 * @hibernate.property column="status" type="java.lang.Short" length="5" not-null="true" unique="false"
	 */
	public Short getStatus() {
		return this.status;
	}
	
	/**
	 * Set the status
	 * @spring.validator type="required"
	 */	
	public void setStatus(Short aValue) {
		this.status = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="education" type="java.lang.String" length="64" not-null="false" unique="false"
	 */
	public String getEducation() {
		return this.education;
	}
	
	/**
	 * Set the education
	 */	
	public void setEducation(String aValue) {
		this.education = aValue;
	}	

	/**
	 * 	 * @return Short
	 * @hibernate.property column="title" type="java.lang.Short" length="32" not-null="false" unique="false"
	 */
	public Short getTitle() {
		return this.title;
	}
	
	/**
	 * Set the title
	 */	
	public void setTitle(Short aValue) {
		this.title = aValue;
	}	

	/**
	 * 	 * @return String
	 * @hibernate.property column="fullname" type="java.lang.String" length="128" not-null="false" unique="false"
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


	public Long getUserlevel() {
		return userlevel;
	}

	public void setUserlevel(Long userlevel) {
		this.userlevel = userlevel;
	}

	/**
	 * @see java.lang.Object#equals(Object)
	 */

	public Short getDelFlag() {
		return delFlag;
	}

	public void setDelFlag(Short delFlag) {
		this.delFlag = delFlag;
	}
	
	public java.math.BigDecimal getCapacity() {
		return capacity;
	}

	public void setCapacity(java.math.BigDecimal capacity) {
		this.capacity = capacity;
	}

	/**
	 * Return the name of the first key column
	 */
	public String getFirstKeyColumnName() {
		return "userId";
	}
	
	
	
	public Set<AppRole> getRoles() {
		return roles;
	}

	public void setRoles(Set<AppRole> roles) {
		this.roles = roles;
	}

	public GrantedAuthority[] getAuthorities() {
		GrantedAuthority[]rights=roles.toArray(new GrantedAuthority[roles.size()+1]);
		rights[rights.length-1]=new GrantedAuthorityImpl("ROLE_PUBLIC");
		return rights;
	}

	public boolean isAccountNonExpired() {
		return true;
	}

	public boolean isAccountNonLocked() {
		return true;
	}

	public boolean isCredentialsNonExpired() {
		return true;
	}

	public boolean isEnabled() {
		if(status==1){
			return true;
		}
		return false;
	}
	
	//overwrite for 
	
	/**
	 * Return the Id (pk) of the entity
	 */
	public String getId() {
		return userId.toString();
	}
	@Override
	public String getBusinessEmail() {
		return email;
	}

	@Override
	public String getFamilyName() {
		return fullname;
	}

	@Override
	public String getGivenName() {
		return fullname;
	}
	public java.math.BigDecimal getInUseCapacity() {
		return inUseCapacity;
	}

	public void setInUseCapacity(java.math.BigDecimal inUseCapacity) {
		this.inUseCapacity = inUseCapacity;
	}
	
	@Override
	public String toString() {
		return new ToStringBuilder(this)
						.append("userId", this.userId) 
				.append("username", this.username) 
				.append("email", this.email) 
				.append("mobile", this.mobile) 
				.append("fullname", this.fullname) 
				.append("position", this.position) 
				.toString();
	}

	public void setTmpPersonnelEmployee(PersonnelEmployee tmpPersonnelEmployee)
	{
		this.tmpPersonnelEmployee = tmpPersonnelEmployee;
	}

	public PersonnelEmployee getTmpPersonnelEmployee()
	{
		return tmpPersonnelEmployee;
	}

	public String getEmailName() {
		return emailName;
	}

	public void setEmailName(String emailName) {
		this.emailName = emailName;
	}

	public String getDepCode() {
		return depCode;
	}

	public void setDepCode(String depCode) {
		this.depCode = depCode;
	}

	public String getOrganization() {
		return organization;
	}

	public void setOrganization(String organization) {
		this.organization = organization;
	}

	public Boolean getIsDineAdmin() {	
		boolean flag =false;
		if(null != roles){
			for (AppRole role:roles)
			{
				if (role.getRoleId()==66)
				{
					flag= true;		
					break;
				}
			}
		}
		return flag;
		//return isDineAdmin;
	}

	public Boolean getIsDepMonitorAdmin() {
		
		boolean flag =false;
		if(null != roles){
			for (AppRole role:roles)
			{
				if (role.getRoleId()==51)//是否部门督办管理员
				{
					flag= true;	
					break;
				}
			}
		}
		return flag;		
	
	}

	public Boolean getIsAdmin() {
		boolean flag =false;
		if(null != roles){
			for (AppRole role:roles)
			{
				if (role.getRoleId()==-1)//是否管理员
				{
					flag= true;		
					break;
				}
			}
		}
		return flag;
	}
	
	public Boolean getIsAdminORArch() {
		boolean flag =false;
		if(null != roles){
			for (AppRole role:roles)
			{
				if (role.getRoleId()==-1||role.getRoleId()==1264323)//是否管理员或公文管理员
				{
					flag= true;		
					break;
				}
			}
		}
		return flag;
	}
	public Boolean getIsDeptFlowAdmin() {
		boolean flag =false;
		if(null != roles){
			for (AppRole role:roles)
			{
				if (role.getRoleId()==24)//是否部门（流程）管理员
				{
					flag= true;		
					break;
				}
			}
		}
		return flag;
	}

	/**
	 * @param isAdmin the isAdmin to set
	 */
	public void setIsAdmin(Boolean isAdmin) {
		this.isAdmin = isAdmin;
	}

	public String getIdNumber() {
		return idNumber;
	}

	public void setIdNumber(String idNumber) {
		this.idNumber = idNumber;
	}
	

	

	
}
