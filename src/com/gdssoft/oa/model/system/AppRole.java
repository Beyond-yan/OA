package com.gdssoft.oa.model.system;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/


import java.util.HashSet;
import java.util.Set;

import org.jbpm.api.identity.Group;
import org.jbpm.api.task.Participation;
import org.springframework.security.GrantedAuthority;

import com.google.gson.annotations.Expose;
import com.gdssoft.core.model.BaseModel;

@SuppressWarnings("serial")
public class AppRole extends BaseModel implements GrantedAuthority,Group{
	
	public static String ROLE_PUBLIC="ROLE_PUBLIC";
	
	public static String ROLE_ANONYMOUS="ROLE_ANONYMOUS";
	
	/**
	 * 超级管理员的角色ID
	 */
	public static final Long SUPER_ROLEID=-1l;
	/**
	 * 超级权限
	 */
	public static final String SUPER_RIGHTS="__ALL";
	@Expose
	private Long roleId;
	@Expose
	private String roleName;
	@Expose
	private String roleDesc;
	@Expose
	private Short status;
	@Expose
	private Short isDefaultIn;
	@Expose
/**
 * 	根据rolelevel来判断角色拥有赋予哪些角色的权限
 */
    private Short roleLevel;
	@Expose
	private String rights;
	
	private Set<AppFunction> functions=new HashSet<AppFunction>();
	private Set<AppUser> appUsers=new HashSet<AppUser>();
	public AppRole() {
		
	}

	public Short getIsDefaultIn() {
		return isDefaultIn;
	}

	public void setIsDefaultIn(Short isDefaultIn) {
		this.isDefaultIn = isDefaultIn;
	}
	

	public Short getRoleLevel() {
		return roleLevel;
	}

	public void setRoleLevel(Short roleLevel) {
		this.roleLevel = roleLevel;
	}

	public Set<AppUser> getAppUsers() {
		return appUsers;
	}

	public void setAppUsers(Set<AppUser> appUsers) {
		this.appUsers = appUsers;
	}

	public String getRights() {
		return rights;
	}

	public void setRights(String rights) {
		this.rights = rights;
	}

	public Long getRoleId() {
		return roleId;
	}
	public void setRoleId(Long roleId) {
		this.roleId = roleId;
	}
	public String getRoleName() {
		return roleName;
	}
	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}
	public String getRoleDesc() {
		return roleDesc;
	}
	public void setRoleDesc(String roleDesc) {
		this.roleDesc = roleDesc;
	}
	public Short getStatus() {
		return status;
	}
	public void setStatus(Short status) {
		this.status = status;
	}

	public String getAuthority() {
		return roleName;
	}

	public int compareTo(Object o) {
		return 0;
	}


	@Override
	public String getId() {
		return roleId.toString();
	}


	@Override
	public String getName() {
		return roleName;
	}


	@Override
	public String getType() {//作为参与的侯选人
		return Participation.CANDIDATE;
	}

	public Set<AppFunction> getFunctions() {
		return functions;
	}

	public void setFunctions(Set<AppFunction> functions) {
		this.functions = functions;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((roleId == null) ? 0 : roleId.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		AppRole other = (AppRole) obj;
		if (roleId == null) {
			if (other.roleId != null)
				return false;
		} else if (!roleId.equals(other.roleId))
			return false;
		return true;
	}

	
}
