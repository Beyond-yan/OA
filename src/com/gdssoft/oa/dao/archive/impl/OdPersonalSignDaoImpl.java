package com.gdssoft.oa.dao.archive.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 GDS ShenZhen Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.archive.OdPersonalSignDao;
import com.gdssoft.oa.model.archive.OdPersonalSign;
import com.gdssoft.oa.model.system.AppUser;

@SuppressWarnings("unchecked")
public class OdPersonalSignDaoImpl extends BaseDaoImpl<OdPersonalSign> implements OdPersonalSignDao{

	public OdPersonalSignDaoImpl() {
		super(OdPersonalSign.class);
	}

	@Override
	public int judgeOdPersonalSignNum(Long userId) {
		// TODO Auto-generated method stub
		String sql="select count(1) from OD_PERSONAL_SIGN where user_id="+userId;
		return this.jdbcTemplate.queryForInt(sql);
	}

	@Override
	public String getOdPersonSign(Long userId) {
		String hql = "from OdPersonalSign ops where ops.appUser.userId=?";
		Object[] params = { userId };
		List<OdPersonalSign> list = findByHql(hql, params);
		OdPersonalSign ops = null;
		if (list.size() != 0) {
			ops = list.get(0);
			return ops.getFileAttach().getFilePath();
		}else{
			return null;
		}
		
	}
	
	

}