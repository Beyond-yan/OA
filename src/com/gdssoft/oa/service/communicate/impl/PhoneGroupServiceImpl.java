package com.gdssoft.oa.service.communicate.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.dao.communicate.PhoneGroupDao;
import com.gdssoft.oa.model.communicate.PhoneGroup;
import com.gdssoft.oa.service.communicate.PhoneGroupService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class PhoneGroupServiceImpl extends BaseServiceImpl<PhoneGroup> implements PhoneGroupService{
	private PhoneGroupDao dao;
	
	public PhoneGroupServiceImpl(PhoneGroupDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public Integer findLastSn(Long userId) {
		return dao.findLastSn(userId);
	}

	@Override
	public PhoneGroup findBySn(Integer sn, Long userId) {
		return dao.findBySn(sn, userId);
	}

	@Override
	public List<PhoneGroup> findBySnUp(Integer sn, Long userId) {
		return dao.findBySnUp(sn, userId);
	}

	@Override
	public List<PhoneGroup> findBySnDown(Integer sn, Long userId) {
		return dao.findBySnDown(sn, userId);
	}

	@Override
	public List<PhoneGroup> getAll(Long userId) {
		return dao.getAll(userId);
	}

}