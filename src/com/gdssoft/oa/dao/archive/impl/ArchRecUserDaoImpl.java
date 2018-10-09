package com.gdssoft.oa.dao.archive.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.dao.archive.ArchRecUserDao;
import com.gdssoft.oa.model.archive.ArchRecUser;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class ArchRecUserDaoImpl extends BaseDaoImpl<ArchRecUser> implements ArchRecUserDao{

	public ArchRecUserDaoImpl() {
		super(ArchRecUser.class);
	}

	@Override
	public List findDepAll() {
		String hql="select ar,dp from ArchRecUser ar right join ar.department dp";
		return findByHql(hql);
	}

	@Override
	public ArchRecUser getByDepId(Long depId) {
		String hql="from ArchRecUser ar where ar.department.depId =?";
		List<ArchRecUser> list = findByHql(hql, new Object[]{depId});
		if(list.size()>0){
			return list.get(0);
		}else{
			return null;
		}
	}

}