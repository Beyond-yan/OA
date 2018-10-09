package com.gdssoft.oa.service.system.impl;

import java.util.List;

import com.gdssoft.oa.dao.system.DictionaryDao;
import com.gdssoft.oa.model.system.Dictionary;
import com.gdssoft.oa.service.system.DictionaryService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class DictionaryServiceImpl extends BaseServiceImpl<Dictionary> implements DictionaryService{
	private DictionaryDao dao;
	
	public DictionaryServiceImpl(DictionaryDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public List<String> getAllItems() {
		return dao.getAllItems();
	}

	@Override
	public List<String> getAllByItemName(String itemName) {
		return dao.getAllByItemName(itemName);
	}
	
	@Override
	public List<Dictionary> getByItemName(String itemName) {
		return dao.getByItemName(itemName);
	}

}