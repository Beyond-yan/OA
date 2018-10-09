package com.gdssoft.oa.service.system.impl;

import java.util.Date;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.system.SnGeneratorDao;
import com.gdssoft.oa.model.system.SnGenerator;
import com.gdssoft.oa.service.system.SnGeneratorService;

public class SnGeneratorServiceImpl extends BaseServiceImpl<SnGenerator> implements SnGeneratorService {

	private SnGeneratorDao dao;
	
	public SnGeneratorServiceImpl(SnGeneratorDao dao) {
		super(dao);
		this.dao = dao;
	}

	@Override
	public String nextSNByPrefix(String prefix, String suffix, int snLength) {
		long newNumber = 1L;
		SnGenerator sn = this.dao.getLastSNByPrefix(prefix);
		if (null != sn) {
			long lastNumber = sn.getSnNumber().longValue();
			newNumber = lastNumber + 1;
			sn.setUpdateDate(new Date());
		} else {
			sn = new SnGenerator();
		}

		sn.setSnPrefix(prefix);
		sn.setSnNumber(newNumber);
		this.dao.save(sn);
		
		String snNumber = "0000000000" + String.valueOf(newNumber);
		snNumber = snNumber.substring(snNumber.length()-snLength);
		return prefix + snNumber + suffix;
	}

	@Override
	public SnGenerator nextSNNumber(String prefix) {
		// TODO Auto-generated method stub
		long newNumber = 1L;
		SnGenerator sn = this.dao.getLastSNByPrefix(prefix);
		if (null != sn) {
			long lastNumber = sn.getSnNumber().longValue();
			newNumber = lastNumber + 1;
			sn.setUpdateDate(new Date());
		} else {
			sn = new SnGenerator();
		}
		sn.setSnPrefix(prefix);
		sn.setSnNumber(newNumber);
		this.dao.save(sn);
		return sn;
	}

}
