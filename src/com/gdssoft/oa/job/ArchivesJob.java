package com.gdssoft.oa.job;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import com.gdssoft.core.Constants;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.flow.ProcessRun;
import com.gdssoft.oa.model.system.SysSchemaConfig;
import com.gdssoft.oa.service.archive.ArchivesService;
import com.gdssoft.oa.service.system.DocFilesService;
import com.gdssoft.oa.service.system.SysSchemaConfigService;
/**
 * 
 * @author Tony Zhang
 *
 */
public class ArchivesJob extends BaseAction{
	@Resource
	private ArchivesService archivesService;
	@Resource
	private SysSchemaConfigService sysSchemaConfigService;
	@Resource
	private DocFilesService docFilesService;
	
	/**
	 * 发文自动归档
	 */
	public void sentArchiveToFile(){
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
		Calendar currentDate = Calendar.getInstance();
		currentDate.setTime(new Date());
		String endDate = formatter.format(currentDate.getTime());
		currentDate.add(currentDate.DATE, -235);
		String startDate = formatter.format(currentDate.getTime());
		List<SysSchemaConfig> schemaConfigList = sysSchemaConfigService.getDefaultSiteSchemas();
		for(SysSchemaConfig schemaConfig : schemaConfigList){
			String schemaCode = schemaConfig.getSchemaCode();
			List<Archives> archList = archivesService.findAllSchemaArchives(schemaCode,Constants.ArchivesType.SENTFILES, Constants.ArchivesStatus.ELECTRONICAL,startDate,endDate);
			docFilesService.saveArchiveToFiles(schemaCode, archList, "SystemAuto");
		}
		
		//docFilesService.saveDocFilesFromArchivesList(archList, "SystemAuto");
	}
	
	/**
	 * 收文自动归档
	 */
	public void sentReceiveArchive(){
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
		Calendar currentDate = Calendar.getInstance();
		currentDate.setTime(new Date());
		String endDate = formatter.format(currentDate.getTime());
		currentDate.add(currentDate.DATE, -235);
		String startDate = formatter.format(currentDate.getTime());
		List<SysSchemaConfig> schemaConfigList = sysSchemaConfigService.getDefaultSiteSchemas();
		for(SysSchemaConfig schemaConfig : schemaConfigList){
			String schemaCode = schemaConfig.getSchemaCode();
			List<Archives> archList = archivesService.findAllSchemaArchives(schemaCode,Constants.ArchivesType.RECEIVEFILES, Constants.ArchivesStatus.FILED,startDate,endDate);
			docFilesService.saveArchiveToFiles(schemaCode, archList, "SystemAuto");
		}
		
		//docFilesService.saveDocFilesFromArchivesList(archList, "SystemAuto");
	}
	
	/**
	 * 修改超过一年没有结束的公文状态为已完成
	 */
	public void updateArchive(){
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
		Calendar currentDate = Calendar.getInstance();
		currentDate.setTime(new Date());
		String endDate = formatter.format(currentDate.getTime());
		currentDate.add(currentDate.DATE, -3);
		String startDate = formatter.format(currentDate.getTime());
		List<SysSchemaConfig> schemaConfigList = sysSchemaConfigService.getDefaultSiteSchemas();
		for(SysSchemaConfig schemaConfig : schemaConfigList){
			String schemaCode = schemaConfig.getSchemaCode();
			List<Archives> archList = archivesService.findAllSchemaArchives(schemaCode,Constants.ArchivesType.RECEIVEFILES, Constants.ArchivesStatus.FILED,startDate,endDate);
			for (Archives archives :archList){
				archives.setStatus((short)3);
				ProcessRun processRun=new ProcessRun();
				processRun.setRunStatus((short)3);
				archives.setProcessRun(processRun);
				archivesService.save(archives);
			}
			docFilesService.saveArchiveToFiles(schemaCode, archList, "SystemAuto");
		}
		
		//docFilesService.saveDocFilesFromArchivesList(archList, "SystemAuto");
	}
	
	
	
	public void setArchivesService(ArchivesService archivesService) {
		this.archivesService = archivesService;
	}

	public void setDocFilesService(DocFilesService docFilesService) {
		this.docFilesService = docFilesService;
	}
	public void setSysSchemaConfigService(
			SysSchemaConfigService sysSchemaConfigService) {
		this.sysSchemaConfigService = sysSchemaConfigService;
	}

}
