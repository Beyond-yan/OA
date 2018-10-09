// Decompiled by Jad v1.5.8e2. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://kpdus.tripod.com/jad.html
// Decompiler options: packimports(3) fieldsfirst ansi space 
// Source File Name:   SecurityDataSource.java

package com.gdssoft.core.security;

import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.service.system.AppRoleService;
import java.util.*;

public class SecurityDataSource
{

	private AppRoleService appRoleService;
	private HashSet anonymousUrls;
	private HashSet publicUrls;
	private HashSet<?> apiUrls;
	

	public HashSet<?> getApiUrls() {
		return apiUrls;
	}

	public void setApiUrls(HashSet<?> apiUrls) {
		this.apiUrls = apiUrls;
	}

	public void setAppRoleService(AppRoleService appRoleService)
	{
		this.appRoleService = appRoleService;
	}

	public SecurityDataSource()
	{
		anonymousUrls = null;
		publicUrls = null;
		apiUrls = null;
	}

	public Set getAnonymousUrls()
	{
		return anonymousUrls;
	}

	public void setAnonymousUrls(Set anonymousUrls)
	{
		this.anonymousUrls = (HashSet)anonymousUrls;
	}

	public HashSet getPublicUrls()
	{
		return publicUrls;
	}

	public void setPublicUrls(HashSet publicUrls)
	{
		this.publicUrls = publicUrls;
	}

	public HashMap getDataSource()
	{
		HashMap tmap = new HashMap();
		if(null != ContextUtil.getCurrentUser())
			tmap = appRoleService.getSecurityDataSource();
		tmap.put(AppRole.ROLE_ANONYMOUS, anonymousUrls);
		tmap.put(AppRole.ROLE_PUBLIC, publicUrls);
		return tmap;
	}
}
