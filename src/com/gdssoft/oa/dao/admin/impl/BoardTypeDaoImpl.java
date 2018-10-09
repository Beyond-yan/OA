package com.gdssoft.oa.dao.admin.impl;

import com.gdssoft.oa.dao.admin.BoardTypeDao;
import com.gdssoft.oa.model.admin.BoardType;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

/**
 * @description BoardTypeDaoImpl
 * @author 宏天软件
 * @date 2010-9-25 PM
 * 
 */
@SuppressWarnings("unchecked")
public class BoardTypeDaoImpl extends BaseDaoImpl<BoardType> implements
		BoardTypeDao {
	public BoardTypeDaoImpl() {
		super(BoardType.class);
	}

}
