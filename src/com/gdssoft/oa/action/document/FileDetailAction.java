package com.gdssoft.oa.action.document;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import javax.annotation.Resource;

import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.system.FileAttach;
import com.gdssoft.oa.model.system.SysArchivesFiles;
import com.gdssoft.oa.service.system.FileAttachService;
import com.gdssoft.oa.service.system.SysArchivesFilesService;

public class FileDetailAction extends BaseAction{
	@Resource
	private FileAttachService fileAttachService;
	@Resource
	private SysArchivesFilesService sysArchivesFilesService;
	
	private FileAttach fileAttach;
	private SysArchivesFiles sysArchivesFiles;
	private Long fileId;

	public Long getFileId() {
		return fileId;
	}

	public void setFileId(Long fileId) {
		this.fileId = fileId;
	}

	public FileAttach getFileAttach() {
		return fileAttach;
	}

	public void setFileAttach(FileAttach fileAttach) {
		this.fileAttach = fileAttach;
	}

	@Override
	public String execute() throws Exception {
		String fileId = getRequest().getParameter("fileId");
		String id = getRequest().getParameter("id");
		if(null != fileId && !"-1".equals(fileId)){
			fileAttach=fileAttachService.get(new Long(fileId));
		}else{
			FileAttach fileAttach1 = new FileAttach();
			sysArchivesFiles = sysArchivesFilesService.get(new Long(id));
			fileAttach1.setFileName(sysArchivesFiles.getFileName());
			fileAttach1.setFilePath(sysArchivesFiles.getFilePath());
			fileAttach1.setCreator(null);
			fileAttach1.setNote(sysArchivesFiles.getFileSize());
			fileAttach1.setCreatetime(sysArchivesFiles.getFileDate());
			fileAttach1.setFileType(sysArchivesFiles.getFileType().toString());
			fileAttach1.setFileId(sysArchivesFiles.getId());
			fileAttach = fileAttach1;
		}
		return SUCCESS;
	}
}
