package com.gdssoft.oa.service.admin.impl;

import com.gdssoft.oa.dao.admin.BoardTypeDao;
import com.gdssoft.oa.model.admin.BoardType;
import com.gdssoft.oa.service.admin.BoardTypeService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

/**
 * @description BoardTypeServiceImpl
 * @author YHZ
 * @date 2010-5-25 PM
 * 
 */
public class BoardTypeServiceImpl extends BaseServiceImpl<BoardType> implements
		BoardTypeService {

	@SuppressWarnings("unused")
	private BoardTypeDao dao;

	public BoardTypeServiceImpl(BoardTypeDao dao) {
		super(dao);
		this.dao = dao;
	}

}
