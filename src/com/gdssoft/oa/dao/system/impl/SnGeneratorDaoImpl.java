package com.gdssoft.oa.dao.system.impl;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.system.SnGeneratorDao;
import com.gdssoft.oa.model.system.SnGenerator;

public class SnGeneratorDaoImpl extends BaseDaoImpl<SnGenerator> implements
		SnGeneratorDao {

	public SnGeneratorDaoImpl() {
		super(SnGenerator.class);
	}

	@Override
	public SnGenerator getLastSNByPrefix(String prefix) {
		String hql = "from SnGenerator g where snPrefix=?";
		Object[] values = {prefix};
		return (SnGenerator)super.findUnique(hql, values);
	}
	
}
