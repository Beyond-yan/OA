package com.gdssoft.oa.service.system.impl;

import java.util.List;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.system.DocDirectoryDao;
import com.gdssoft.oa.model.system.DocDirectory;
import com.gdssoft.oa.service.system.DocDirectoryService;

public class DocDirectoryServiceImpl extends BaseServiceImpl<DocDirectory> implements
DocDirectoryService {

	private DocDirectoryDao dao;
	public DocDirectoryServiceImpl(DocDirectoryDao dao) {
		super(dao);
		this.dao=dao;
	}
	
	@Override
	public List<DocDirectory> findAllLevel4() {
		return null;
	}
	@Override
	public List<DocDirectory> findByParentId(Long parentId) {
		return dao.findByParentId(parentId);
	}
	public List<DocDirectory> findByDeptId(Long deptId) {
		return dao.findByDeptId(deptId);
	}
	
	/**
	 * 查询归档文件的大小
	 * 
	 * @param docDirectory
	 * @return
	 */
	@Override
	public Double getTotalBytes(DocDirectory docDirectory) {
		return dao.getTotalBytes(docDirectory);
	}
}
