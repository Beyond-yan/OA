package com.gdssoft.oa.service.point;

import java.text.ParseException;

import javax.jws.WebMethod;
import javax.jws.WebService;

@WebService
public interface ArchivesMonitorService {

	String SearchPublicArchives(String schemaCode, String username) throws ParseException;

}
