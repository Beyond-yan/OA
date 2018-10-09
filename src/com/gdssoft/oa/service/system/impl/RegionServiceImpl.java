package com.gdssoft.oa.service.system.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import java.util.List;

import com.gdssoft.oa.dao.system.RegionDao;
import com.gdssoft.oa.model.system.Region;
import com.gdssoft.oa.service.system.RegionService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class RegionServiceImpl extends BaseServiceImpl<Region> implements RegionService{
	private RegionDao dao;
	
	public RegionServiceImpl(RegionDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public List<Region> getProvince() {
		return dao.getProvince();
	}

	@Override
	public List<Region> getCity(Long regionId) {
		return dao.getCity(regionId);
	}

}