package com.gdssoft.oa.dao.personal.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.Date;
import java.util.List;
import java.util.Set;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.oa.dao.personal.AddrbookOuterDao;
import com.gdssoft.oa.model.personal.AddrbookOuter;
import com.gdssoft.oa.model.personal.Duty;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;

@SuppressWarnings("unchecked")
public class AddrbookOuterDaoImpl extends BaseDaoImpl<AddrbookOuter> implements AddrbookOuterDao{

	public AddrbookOuterDaoImpl() {
		super(AddrbookOuter.class);
	}
	@Override
	public List<AddrbookOuter> getouter(String personname){
		AppUser user = ContextUtil.getCurrentUser();
		Set<AppRole> roles = user.getRoles();
		boolean isAdmin = false;
		for (AppRole role : roles) {
			if (role.getRoleId().toString().equals("-1")) {
				isAdmin = true;
			}}
		String conditions = "";
		if(isAdmin = false)
		conditions += "and ad.createBy="+"'"+user.getUsername()+"'";
		String hql="from AddrbookOuter ad where ad.mobile=? " + conditions;
		return findByHql(hql,new Object[]{personname});
	}
}