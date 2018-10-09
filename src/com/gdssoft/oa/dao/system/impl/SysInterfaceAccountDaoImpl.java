package com.gdssoft.oa.dao.system.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import org.hibernate.Query;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.system.SysInterfaceAccountDao;
import com.gdssoft.oa.model.system.SysInterfaceAccount;

@SuppressWarnings("unchecked")
public class SysInterfaceAccountDaoImpl extends BaseDaoImpl<SysInterfaceAccount> implements SysInterfaceAccountDao{

	public SysInterfaceAccountDaoImpl() {
		super(SysInterfaceAccount.class);
	}
	
	public List<SysInterfaceAccount> getByAccount(Long id){
		String hql = "from SysInterfaceAccount sia where sia.sysServiceAccount.id=:id";
		Query query = this.getSession().createQuery(hql).setParameter("id", id);
		if(query.list().size() > 0) return query.list();
		return null;
	}
	
	public int removeByAccount(Long id){
		String hql = "delete from SysInterfaceAccount sia where sia.sysServiceAccount.id=:id";
		Query query = this.getSession().createQuery(hql).setParameter("id", id);
		return query.executeUpdate();
	}

}